const {
    Scenes,
    Telegraf, session, Markup
} = require('telegraf')

const bot = new Telegraf('2019192872:AAHAYPXof29I2Mf5uvh_YuZi6ZPvzzlvHZs')

const {MongoClient} = require('mongodb')
const db = new MongoClient('mongodb+srv://iterhim:igornazar5@cluster0.ieu9k.mongodb.net/PROJETIGOR?retryWrites=true&w=majority')

const styd = {}
const vykladach = {}

// const studets = db.db().collection('studets')

class SceneGenerator {
    GenPIBScene() {
        try {
            const PIB = new Scenes.BaseScene('PIB')
            PIB.enter(async (ctx) => {
                await ctx.reply('Введіть ПІБ студента)')
            })
            PIB.on('text', async (ctx) => {
                const pib = ctx.message.text
                if (pib) {
                    // await ctx.reply('спасибки')
                    await ctx.reply(`<b>ПІБ введено правильно? ${pib}</b>`, {
                        parse_mode: 'HTML',
                        ...Markup.inlineKeyboard(
                            [
                                [Markup.button.callback('Так', 'goodNumStud')],
                                [Markup.button.callback('Змінити', 'changeNumStud')],

                            ])
                    })

                } else {
                    await ctx.reply('ПІБ не введено!)')
                    await ctx.scene.reenter()
                }
                styd.pib = pib;
            })
            PIB.on('message', async (ctx) => ctx.reply('давай краще вік'))
            PIB.action('goodNumStud', async (ctx, next) => {
                await ctx.reply('чудово!')
                await ctx.scene.enter('Nstud')
            })
            PIB.action('changeNumStud', async (ctx, next) => {
                await ctx.reply('введіть знову ПІБ студента')
                await ctx.scene.reenter()
            })
            return PIB;
        } catch (e) {
            console.log(e)
        }

    }

    GenNumScene() {
        try {
            const NUM = new Scenes.BaseScene('Nstud')
            NUM.enter(async (ctx) => {
                await ctx.reply('Введіть номер студентського квитка')
            })
            NUM.on('text', async (ctx) => {
                    const num = +ctx.message.text
                    if (num) {
                        await ctx.reply(`<b>ПІБ введено правильно? ${num}</b>`, {
                            parse_mode: 'HTML',
                            ...Markup.inlineKeyboard(
                                [
                                    [Markup.button.callback('Так', 'goodIdStud')],
                                    [Markup.button.callback('Змінити', 'changeIdStud')],

                                ])
                        })
                    } else {
                        await ctx.reply('введіть цифрами, будь ласка!')
                        await ctx.scene.reenter()
                    }
                    styd.num = num;
                }
            )

            NUM.on('message', async (ctx) => ctx.reply('напишіть, будь ласка циферками'))
            NUM.action('goodIdStud', async (ctx, next) => {
                await ctx.reply('чудово!')
                await db.connect()


                console.log('всьо ок')
                const students = db.db().collection('students')
                await students.insertOne(styd)
                console.log(styd)
                await ctx.scene.leave()
            })
            NUM.action('changeIdStud', async (ctx, next) => {
                await ctx.scene.reenter()
            })
            // NUM.action('start', async (ctx, next) => {
            //     await ctx.scene.enter(this.GenPIBVScene())
            // })
            // NUM.action('end', async (ctx, next) => {
            //     await db.connect()
            //     console.log('всьо ок')
            //     const students = db.db().collection('students')
            //     await students.insertOne(styd)
            //     await ctx.scene.leave()
            // })
            // NUM.leave(async (ctx)=>{
            //
            // })
            return NUM
        } catch (e) {
            console.log(e)
        }

    }

    GenPIBVScene() {
        try {
            const PIBv = new Scenes.BaseScene('PIBv')
            PIBv.enter(async (ctx) => {
                await ctx.reply('Введіть ПІБ викладача)')
            })
            PIBv.on('text', async (ctx) => {
                const pib = ctx.message.text
                if (pib) {
                    await ctx.reply(`<b>ПІБ введено правильно? ${pib}</b>`, {
                        parse_mode: 'HTML',
                        ...Markup.inlineKeyboard(
                            [
                                [Markup.button.callback('Так', 'goodPIBVykl')],
                                [Markup.button.callback('Змінити', 'changePIBVykl')],

                            ])
                    })

                    // await bot.telegram.sendMessage(ctx.chat.id, `ПІБ введено правильно? ${pib}`)
                } else {
                    await ctx.reply('ПІБ не введено!)')
                    await ctx.scene.reenter()
                }
                vykladach.pib = pib;

            })
            PIBv.action('goodPIBVykl', async (ctx, next) => {
                await ctx.reply('чудово!')
                await ctx.scene.enter('Nvykl')
            })
            PIBv.action('changePIBVykl', async (ctx, next) => {
                await ctx.reply('введіть знову ПІБ викладача')
                await ctx.scene.reenter()
            })
            PIBv.on('message', async (ctx) => ctx.reply('давай краще вік'))
            return PIBv;
        } catch (e) {
            console.log(e)
        }

    }

    GenNumvScene() {
        try {
            const NUMv = new Scenes.BaseScene('Nvykl')
            NUMv.enter(async (ctx) => {
                await ctx.reply('Введіть універсальний код доступу')
            })
            NUMv.on('text', async (ctx) => {
                const num = +ctx.message.text
                if (num) {
                    await ctx.reply(`<b>спасибі, введений код: ${num}?</b>`, {
                        parse_mode: 'HTML',
                        ...Markup.inlineKeyboard(
                            [
                                [Markup.button.callback('Так', 'goodIdVykl')],
                                [Markup.button.callback('Змінити', 'changeIdVykl')],

                            ])
                    })
                    // await bot.telegram.sendMessage(ctx.chat.id, `спасибі, введений код: ${num}?`, dad)
                    // await ctx.scene.leave()
                } else {
                    await ctx.reply('введіть цифрами, будь ласка!')
                    await ctx.scene.reenter()
                }
                vykladach.number = num;

            })
            NUMv.action('goodIdVykl', async (ctx, next) => {
                await ctx.reply('чудово!')
                await ctx.scene.enter('arrstud')
            })
            NUMv.action('changeIdVykl', async (ctx, next) => {
                await ctx.reply('введіть знову код викладача')
                await ctx.scene.reenter()
            })


            NUMv.on('message', async (ctx) => ctx.reply('напишіть, будь ласка циферками'))
            return NUMv
        } catch (e) {
            console.log(e)
        }

    }


    GenArrStudScene() {
        try {
            const ARRSTUD = new Scenes.BaseScene('arrstud')
            ARRSTUD.enter(async (ctx) => {
                await ctx.reply('введіть ім\'я студента')
            })
            ARRSTUD.on('text', async (ctx) => {
                    const stud = ctx.message.text
                    if (stud) {
                        await ctx.reply(`<b>спасибі, введене ім\`я студента: ${stud}?</b>`, {
                            parse_mode: 'HTML',
                            ...Markup.inlineKeyboard(
                                [
                                    [Markup.button.callback('Так', 'goodName')],
                                    [Markup.button.callback('Змінити', 'chName')],

                                ])
                        })

                    } else {
                        await ctx.reply('введіть цифрами, будь ласка!')
                        await ctx.scene.reenter()
                    }

                    // await ctx.scene.enter('lessname')
                    vykladach.stud = stud;


                }
            )
            ARRSTUD.action('goodName', async (ctx, next) => {
                await ctx.reply('чудово!')
                await ctx.scene.enter('lessname')
            })
            ARRSTUD.action('chName', async (ctx, next) => {
                await ctx.reply('введіть знову')
                await ctx.scene.reenter()
            })

            ARRSTUD.on('message', async (ctx) => ctx.reply('напишіть, будь ласка циферками'))
            return ARRSTUD
        } catch (e) {
            console.log(e)
        }

    }

    GenLessNameScene() {
        try {
            const LESSNAME = new Scenes.BaseScene('lessname')
            LESSNAME.enter(async (ctx) => {
                await ctx.reply('введіть назву предмету')

            })
            LESSNAME.on('text', async (ctx) => {
                    const lesson = ctx.message.text
                    if (lesson) {
                        await ctx.reply(`<b>спасибі, назва предмету: ${lesson}?</b>`, {
                            parse_mode: 'HTML',
                            ...Markup.inlineKeyboard(
                                [
                                    [Markup.button.callback('Так', 'lessongood')],
                                    [Markup.button.callback('Змінити', 'lessonch')],

                                ])
                        })
                    } else {
                        await ctx.reply('назву предмету не введено!)')
                        await ctx.scene.reenter()
                    }
                    vykladach.lesson = lesson;


                }
            )
            LESSNAME.action('lessongood', async (ctx, next) => {
                await ctx.reply('чудово!')
                await db.connect()
                console.log('всьо ок')
                console.log(vykladach)
                const users = db.db().collection('vykladachs');

                await users.insertOne(vykladach)

                await ctx.scene.leave()
            })

            LESSNAME.action('lessonch', async (ctx, next) => {
                await ctx.reply('введіть знову')
                await ctx.scene.reenter()
            })

            LESSNAME.on('message', async (ctx) => ctx.reply('напишіть, будь ласка циферками'))
            return LESSNAME
        } catch (e) {
            console.log(e)
        }

    }
}


module.exports = SceneGenerator;


