import React from "react";
import data from "./data";
import styled from "styled-components";
import snarkdown from "snarkdown";

class App extends React.Component {
  /**
   * Recursive function to extract elements based on child.component value
   */
  extractElements = propsChildren => {
    return (
      Array.isArray(propsChildren) &&
      propsChildren.length &&
      propsChildren.map(child => {
        if (child && child.component) {
          switch (child.component) {
            case "Section":
              return this.componentWithChildren(
                "section",
                child.props.children || [],
                child.props || {}
              );
            case "Card":
              return this.componentWithChildren(
                (child.props &&
                  child.props.className &&
                  child.props.className) ||
                  "card",
                child.props.children || [],
                child.props || {}
              );
            case "Markdown":
              return this.markdownComponent(child.props && child.props.text);
            case "Tag":
              return this.tagComponent(child.props && child.props);
            case "Row":
              return this.componentWithChildren(
                (child.props &&
                  child.props.className &&
                  child.props.className) ||
                  "row",
                child.props.children || [],
                child.props || {}
              );
            case "Col":
              return this.componentWithChildren(
                (child.props &&
                  child.props.className &&
                  child.props.className) ||
                  "col",
                child.props.children || [],
                child.props || {}
              );
            default:
              return null;
          }
        }

        return null;
      })
    );
  };

  /**
   * Function to extract component which can have childrens
   * return `<div className={className}>{children}</div>`
   */
  componentWithChildren = (className, children, props) => {
    return (
      <ComponentWithChildren key={Math.random()} className={className}>
        {(props.title || props.link || props.text) && (
          <ComponentProps className="parent-props">
            {props.title && <Title>{props.title}</Title>}
            {props.link && <Link>{props.link}</Link>}
            {props.text && <Text>{props.text}</Text>}
          </ComponentProps>
        )}
        {this.extractElements(children) || ""}
      </ComponentWithChildren>
    );
  };

  /**
   * Function for Markdown component
   */
  markdownComponent = (mdText = "") => {
    return (
      <MarkDownOutput
        className="markdown"
        key={Math.random()}
        ref={ref => ref.appendChild(this.domParser("div", snarkdown(mdText)))}
      />
    );
  };

  /**
   * Function for Tag component
   */
  tagComponent = ({ children, className, tag }) => {
    if (!Array.isArray(children)) {
      return (
        <TagContainer
          key={Math.random()}
          className={className || "tag"}
          ref={ref => ref.appendChild(this.domParser(tag, children))}
        ></TagContainer>
      );
    } else if (Array.isArray(children) && children.length) {
      return children.map(child => {
        return (
          <TagContainer
            key={Math.random()}
            className={className || "tag"}
            ref={ref => ref.appendChild(this.domParser(tag, child))}
          ></TagContainer>
        );
      });
    } else {
      return null;
    }
  };

  /**
   * Function to parse string as dom
   */
  domParser = (tag, children) => {
    const elem = document.createElement(tag);
    elem.innerHTML = children;
    return elem;
  };

  render() {
    return (
      <OutputContainer className="output-container">
        {this.extractElements(data)}
      </OutputContainer>
    );
  }
}

const OutputContainer = styled.div``;

const ComponentWithChildren = styled.div``;

const Title = styled.span``;

const Link = styled.span``;

const Text = styled.span``;

const MarkDownOutput = styled.div``;

const TagContainer = styled.div``;

const ComponentProps = styled.div``;

export default App;
