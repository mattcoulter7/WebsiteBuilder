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
import CustomFocusser from "../components/Website/PageComponents/CustomFocusser"
import ComponentMapping from "../components/Website/PageComponents/ComponentMapping"

import Section from "../components/Website/PageComponents/Layouts/Section"

import { params } from "../Utils/QueryString"


export default class EditPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            children: [],
            page: null,
            website: null,
            pages: []
        }
        this._id = null;
        this.handler = this.handler.bind(this);
        document.addEventListener("keydown", (e) => {
            if (e.key == "Escape") {
                this.onDeselect();
            }
        })
    }

    handler() {
        return this;
    }
    onDelete(child){
        this.setState({
            children:this.state.children.filter(c => c != child)
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
        Section.active && Section.active.setState({
            focus: false
        })
    }

    onNewSection(){
        ComponentMapping.Section.create(this._id)
            .then((result) => {
                this.setState({
                    children: this.state.children.concat(result)
                })
            })
    }

    render() {
        return (
            <Page>
                <CustomFocusser
                    onBlur={() => this.onDeselect()}>
                    {
                        this.state.children
                            .filter(c => c.type == "Section")
                            .map(comp => {
                                const CustomComponent = ComponentMapping[comp.type]
                                return (<>
                                    <NewLine onNew={() => this.onNewSection()}></NewLine>
                                    <CustomComponent.edit website={this.state.website} page={this.state.page} pages={this.state.pages} component={comp} parentContext={this.handler}/>
                                </>)
                            })
                    }
                    <NewLine onNew={() => this.onNewSection()}></NewLine>
                </CustomFocusser>
            </Page>
        );
    }
}