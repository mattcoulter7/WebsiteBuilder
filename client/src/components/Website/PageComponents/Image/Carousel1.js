import React from "react";

import { Carousel } from "react-bootstrap";

import EditComponent from "../EditComponent";

export default class Carousel1_EDIT extends EditComponent {
    render() {
        return (
            <Carousel>
                {
                    this.state.children
                        .filter((c) => c.type == "CarouselItem1")
                        .map(comp => {

                            return (<Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={comp.src}
                                    alt={comp.src}
                                />
                                <Carousel.Caption>
                                    <div dangerouslySetInnerHTML={{ __html: comp.value || "" }}></div>
                                </Carousel.Caption>
                            </Carousel.Item>)
                        })
                }
            </Carousel>
        );
    }
}