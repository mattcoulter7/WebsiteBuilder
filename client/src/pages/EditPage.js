import React, { useState, useEffect, useRef } from 'react';
import { Navigate, parsePath, useParams } from 'react-router-dom';
import { loremIpsum } from 'react-lorem-ipsum';

import ComponentDTO from "../DTOs/ComponentDTO"
import ComponentDAO from "../DAOs/ComponentDAO"
import PageDTO from "../DTOs/PageDTO"
import PageDAO from "../DAOs/PageDAO"
import WebsiteDTO from "../DTOs/WebsiteDTO"
import WebsiteDAO from "../DAOs/WebsiteDAO"

import Page from '../layouts/Page';

import NewLine from "../components/Website/PageComponents/NewLine"
import IFocusable from "../components/Website/PageComponents/IFocusable"
import ComponentMapping from "../components/Website/PageComponents/ComponentMapping"

import Section from "../components/Website/PageComponents/Layouts/Section"

import { params } from "../Utils/QueryString"

import Panel from '../components/Website/EditWebsite/Panel';
import EditableComponent from '../components/Website/PageComponents/EditableComponent';

import NewMenu from "../components/Website/PageComponents/NewMenu"


export default class EditPage extends IFocusable {
    constructor(props) {
        super(props);
        this.state = {
            children: [],
            page: null,
            website: null,
            pages: []
        }
        this._id = null;

        document.addEventListener("keydown", (e) => {
            if (e.key == "Escape") {
                this.onDeselect();
            }
        })
    }
    whenDelete(child) {
        this.setState({
            children: this.state.children.filter(c => c != child)
        })
    }
    whenInsert(child) {
        this.setState({
            children: this.state.children.concat(child)
        })
    }

    componentDidMount() {
        this._id = params()._id;

        ComponentDAO
            .select()
            .then((components) => {
                // extract components specific to the page
                return components.filter(c => c.parentId == this._id)
            })
            .then((components) => {
                // store against state
                this.setState({
                    children: components
                })
            })

        PageDAO
            .selectId(this._id)
            .then((page) => {
                this.setState({
                    page: page
                })

                WebsiteDAO
                    .selectId(page.websiteId)
                    .then((website) => {
                        this.setState({
                            website: website
                        })

                        PageDAO
                            .select()
                            .then((pages) => {
                                return pages.filter(p => p.websiteId == website._id)
                            })
                            .then((pages) => {
                                this.setState({
                                    pages: pages
                                })
                            })
                    });
            })
    }

    onDeselect() {
        EditableComponent.active && EditableComponent.active.setState({
            focus: false
        })
        this.setState({
            showNewMenu: false
        })
    }

    onNew() {
        this.setState({
            showNewMenu: true
        })
    }

    mousedownonBlur(e) {
        this.onDeselect()
    }

    render() {
        return (
            <IFocusable
                mousedownonBlur={(e) => this.mousedownonBlur(e)}>
                <Page>
                    {
                        this.state.children
                            .filter(c => c.type == "Section")
                            .map(comp => {
                                const CustomComponent = ComponentMapping[comp.type]
                                return (<>
                                    <NewLine onNew={() => this.onNew()}></NewLine>
                                    <CustomComponent.edit
                                        key={comp._id}
                                        website={this.state.website}
                                        page={this.state.page}
                                        pages={this.state.pages}
                                        component={comp}
                                        parentContext={() => this} />
                                </>)
                            })
                    }
                    <NewLine onNew={() => this.onNew()}></NewLine>
                    {
                        (() => {
                            return this.state.showNewMenu ? <NewMenu
                                style={{
                                    right: "20%",
                                    top: "40%"
                                }}
                                website={this.state.website}
                                page={this.state.page}
                                onClose={() => this.setState({
                                    showNewMenu: false
                                })}
                                context={() => this}
                            /> : null
                        })()

                    }
                </Page >
            </IFocusable>
        );
    }
}