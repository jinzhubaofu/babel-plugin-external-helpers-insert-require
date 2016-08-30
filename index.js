/**
 * @file 插入 babelHelpers 的 require 语句插件
 * @author leon <ludafa@outlook.com>
 */

var p = require('path');
var dirname = p.dirname;
var relative = p.relative;

module.exports = function plugin(babel) {

    var t = babel.types;

    return {

        visitor: {

            Program: {
                exit: function (path, state) {

                    var file = state.file;
                    var metadata = file.get('helpersNamespace');


                    if (!metadata || !metadata.name) {
                        return;
                    }

                    if (!file.usedHelpers || !Object.keys(file.usedHelpers).length) {
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
