import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import React from "react";
import { GeistMono } from "geist/font/mono";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import powershell from "highlight.js/lib/languages/powershell";
import ini from "highlight.js/lib/languages/ini";
import plaintext from "highlight.js/lib/languages/plaintext";
import csharp from "highlight.js/lib/languages/csharp";
import typescript from "highlight.js/lib/languages/typescript";


import "highlight.js/styles/github-dark.css";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("powershell", powershell);
hljs.registerLanguage("ini", ini);
hljs.registerLanguage("plaintext", plaintext);
hljs.registerLanguage("csharp", csharp);
hljs.registerLanguage("typescript", typescript);

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ));
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function CustomLink(props) {
  let href = props.href;

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

function RoundedImage(props) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />;
}

function Code({ children, ...props }) {
  const language = props.className?.replace(/^language-/, "") || "plaintext";

  let codeHTML = hljs.highlight(children, { language }).value;
  return (
    <code
      dangerouslySetInnerHTML={{ __html: codeHTML }}
      {...props}
      className={`${GeistMono.className}`}
    />
  );
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children);
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor",
        }),
      ],
      children
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  Table,
};

export function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}
