import React from "react";

import ConfigurableComponent from "../ConfigurableComponent";

import ComponentMapping from "../ComponentMapping";

export default class Section extends ConfigurableComponent {
    render() {
        if (!this.props.page) return null;
        return (
            this.state.children
                .map(comp => {
                    const CustomComponent = ComponentMapping[comp.type]
                    return <CustomComponent.preview website={this.props.website} page={this.props.page} pages={this.props.pages} component={comp} />
                })
        )
    }
}