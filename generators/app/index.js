const Generator = require('yeoman-generator')

module.exports = class extends Generator{
    prompting(){
        return this.prompt([
            {
                type:'input',
                name:'name',
                message:'Your project name',
                default:this.appname
            }
        ]).then(answers => {
            this.answers = answers
        })
    }
    writing() {
        //将每一个文件都通过模版转换成目标路径
        //通过循环的方式批量生成每一个文件
        const templates = [
            'public',
            'src/api',
            'src/assets',
            'src/components',
            'src/mock',
            'src/plugins',
            'src/utils',
            'src/views',
            'src/App.vue',
            'src/element-variables.scss',
            'src/main.js',
            'src/permission.js',
            'src/router.js',
            'src/store.js',
            '.browserslistrc',
            '.gitignore',
            'babel.config.js',
            'package.json',
            'package-lock.json',
            'postcss.config.js',
            'README.md',
            'remark.txt',
            'vue.config.js',
            'yarn.lock'
        ]
        templates.forEach(item =>{
            this.fs.copyTpl(
                this.templatePath(item),
                this.destinationPath(item),
                this.answers
            )
        })
    }
}