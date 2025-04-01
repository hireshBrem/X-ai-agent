const rules = (blockClass) => [
    `.${blockClass} { background: currentColor }`,
    'noscript { display: none !important; }',
];

export { rules as default };
