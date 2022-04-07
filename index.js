const {MenuTemplate, MenuMiddleware} = require('telegraf-inline-menu')

const {Telegraf, Markup, Scenes, session} = require('telegraf')

const bot = new Telegraf('2019192872:AAHAYPXof29I2Mf5uvh_YuZi6ZPvzzlvHZs')

const SceneGenerator = require('./Scenes')
const {MongoClient} = require('mongodb')

const client = new MongoClient('mongodb+srv://iterhim:igornazar5@cluster0.ieu9k.mongodb.net/PROJETIGOR?retryWrites=true&w=majority')


const CurScene = new SceneGenerator()

const pibScene = CurScene.GenPIBScene()
const numScene = CurScene.GenNumScene()
const pibvScene = CurScene.GenPIBVScene()
const numvScene = CurScene.GenNumvScene()
const arrstud = CurScene.GenArrStudScene()
const PIBk = CurScene.GenPIBKScene()
const emK = CurScene.GenEmailKScene()
const MPk = CurScene.GenPhoneKScene()
const zakl = CurScene.GenzakladScene()
const parK = CurScene.GenParKScene()

const lessname = CurScene.GenLessNameScene()

const stage = new Scenes.Stage([
    pibScene,
    numScene,
    pibvScene,
    numvScene,
    arrstud,
    lessname,
    PIBk,
    emK,
    MPk,
    zakl,
    parK,
]);
bot.use(stage.middleware())








let vykladach = {}

bot.command('start',(ctx) => {
    return ctx.reply('<b>виберіть хто ви</b>', {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(
            [
            [Markup.button.callback('Адміністатор', 'admin')],
            [Markup.button.callback('Куратор', 'kurator')],
            [Markup.button.callback('Викладач', 'teacher')],
            [Markup.button.callback('Студент', 'student')]
        ])
    })
})
bot.action('admin',(ctx)=>{
    return ctx.reply('<b>Адмін меню</b>', {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(
            [
                [Markup.button.callback('Зупинити роботу бота', 'startStop')],
                [Markup.button.callback('Перевірити список зареєстрованих акаунтів', 'checkall')],
                [Markup.button.callback('Зареєструвати акаунт куратора', 'newKurator')],
                [Markup.button.callback('Список усіх профілів', 'fullListprofils')],
                [Markup.button.callback('Добавити профіль', 'addprofil')]
            ])
    })
})
bot.action('checkall',(ctx)=>{
    return ctx.reply('<b>Перевірити список зареєстрованих акаунтів</b>', {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(
            [
                [Markup.button.callback('Список усіх викладачів', 'fullListVukladachiv')],
                [Markup.button.callback('Список усіх студентів', 'fullListstudents')],
                [Markup.button.callback('Список усіх кураорів', 'newKurator')],
            ])
    })
})

bot.action('kurator', (ctx, next) => {
    return ctx.reply('<b>Куратор меню</b>', {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(
            [
                [Markup.button.callback('Список усіх викладачів', 'fullListVukladachiv')],
                [Markup.button.callback('Добавити викладача', 'addVukladacha')],
                [Markup.button.callback('Список усіх студентів', 'fullListstudents')],
                [Markup.button.callback('Добавити студента', 'addstudenta')],
                [Markup.button.callback('Список усіх профілів', 'fullListprofils')],
                [Markup.button.callback('Добавити профіль', 'addprofil')]
            ])
    })
})

bot.action('fullListVukladachiv', async (ctx, next) => {

        await ctx.reply('масивчик викладачів, яких добавив куратор)')

        await client.connect()
        console.log('всьо ок')
        const users = client.db().collection('vykladachs');

        const user = await users.findOne()
        console.log(user);

        let a = JSON.stringify(user);
        await ctx.reply(a)
}, )
bot.action('fullListstudents', async (ctx, next) => {

        await ctx.reply('масивчик студентів, яких добавив куратор)')

        await client.connect()
        console.log('всьо ок')
        const users = client.db().collection('students');

        const user = await users.findOne()
        console.log(user);

        let a = JSON.stringify(user);
        await ctx.reply(a)
}, )


bot.use(session())
bot.use(stage.middleware())
bot.use(Telegraf.log())




bot.action('addVukladacha', async (ctx, next) => {

    await ctx.reply('ф-ця добавляння викладача)')
    await ctx.scene.enter('PIBv')

})
bot.action('addstudenta', async (ctx, next) => {

    await ctx.reply('ф-ця добавляння студента)')
    await ctx.scene.enter('PIB')

})
bot.action('newKurator', async (ctx, next) => {

    await ctx.reply('ф-ця добавляння студента)')
    await ctx.scene.enter('PIBk')

})
//
bot.command("test", ctx=>ctx.scene.enter("PIBv"))
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.command('/scene', async (ctx) => {
    // ctx.scene.enter('age')
})

bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

