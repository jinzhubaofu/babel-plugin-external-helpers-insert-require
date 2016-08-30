# babel-plugin-external-helpers-insert-require

insert `require` statement in your file if externalHelpers used.

So you can remove babel-runtime from dependences if no either core-js nor regenerator used! Useful for a build a library.

## NOTICE

`commonjs` / `amd` / `umd` are supported.

`systemjs` is not supported.

## setup

add this plugin after `external-helpers` in your `.babelrc` file:

```json
{
    "presets": [
        [
            "es2015",
            {
                "loose": true,
                "modules": "amd"
            }
        ],
        "react"
    ],
    "plugins": [
        "transform-object-rest-spread",
        "external-helpers",
        "external-helpers-insert-require"
    ]
}
```
