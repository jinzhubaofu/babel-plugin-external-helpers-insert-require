/**
 * @file 插入 babelHelpers 的 require 语句插件
 * @author leon <ludafa@outlook.com>
 */

var p = require('path');
var dirname = p.dirname;
var relative = p.relative;

module.exports = function plugin(babel) {

    var t = babel.types;

    var needToInsert = false;

    return {

        visitor: {

            ImportSpecifier: function () {
                needToInsert = true;
            },

            ImportDefaultSpecifier: function () {
                needToInsert = true;
            },

            ImportNamespaceSpecifier: function () {
                needToInsert = true;
            },

            Program: {

                enter: function () {
                    console.log('program enter');
                    needToInsert = false;
                },

                exit: function (path, state) {

                    console.log('program exit');

                    var file = state.file;
                    var metadata = file.get('helpersNamespace');


                    if (
                        // 没有使用 external helpers 插件
                        !metadata || !metadata.name
                        // 没有使用到任何 helpers 并且也没有使用 import
                        || !(file.usedHelpers && Object.keys(file.usedHelpers).length) && !needToInsert
                    ) {
                        return;
                    }

                    var externalHelperName = metadata.name;

                    var modulePath = relative(
                        dirname(file.opts.filenameRelative),
                        dirname(externalHelperName)
                    ) || '.';

                    modulePath = modulePath + '/' + externalHelperName;

                    var declar = t.variableDeclaration('var', [
                        t.variableDeclarator(
                            t.identifier(externalHelperName),
                            t.callExpression(
                                t.identifier('require'),
                                [t.stringLiteral(modulePath)]
                            )
                        )
                    ]);

                    declar._blockHoist = 3;

                    path.unshiftContainer('body', declar);

                }
            }

        }
    };

};
