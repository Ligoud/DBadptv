var { Pool } = require('pg')
var uri = 'postgres://postgres:4049@localhost:5432/dbtest'
var client = new Pool({
    connectionString: uri
})

client.connect((err) => {
    if (err)
        console.error(err)
    else
        console.log('Соединение установлено')
})

class myPg {
    constructor() {
        /* #region  constructor */
        client.query("create table if not exists questions (questID serial PRIMARY KEY,theme text default 'neutral',level integer NOT NULL,type text NOT NULL,question text NOT NULL UNIQUE, cases text[] default '{}',answer text NOT NULL, delted bool default false);", (err, res) => {
            if (err)
                console.error(err)
        })
        client.query("create table if not exists users (login text PRIMARY KEY,password text NOT NULL,name text default '-', user_group text default '-',role text default 'user')", (err, res) => {
            if (err)
                console.error(err)
        })
        client.query("create table if not exists results (testID int PRIMARY KEY check (testID>0), userid text references users(login) ON DELETE CASCADE,level int NOT NULL, rightAnswers int NOT NULL, wrongAnswers int NOT NULL)", (err, res) => {
            if (err)
                console.error(err)
        })
        client.query("create table if not exists resultinfo (testID int references results ON DELETE CASCADE,questID int references questions, answer text default '-', result boolean NOT NULL)", (err, res) => {
        })
        client.query("create or replace function addQuest(text,text,integer,text,text,text) returns void as $$ declare res text[]; begin if(length($5)>0) then $5:=lower($5); res:=split($5); end if; INSERT INTO questions (type,theme,level,question,cases,answer) values ($1,$2,$3,$4,res,$6); end $$ language plpgsql;", (err, res) => { })

        client.query("create function to_lowercase() returns trigger as $to_lowercase$ begin NEW.question := lower(NEW.question); NEW.theme := lower(NEW.theme); NEW.answer:=lower(NEW.answer); return NEW; end; $to_lowercase$ language plpgsql;", (err, res) => { })
        client.query("CREATE TRIGGER to_lowercase BEFORE INSERT ON questions FOR EACH ROW EXECUTE PROCEDURE to_lowercase();", (err, res) => { })
        /* #endregion */
    }
    /* #region  Модуль тестирования */
    async addTestResult(resultsObj, resultInfoObj) {
        //client.query({text:'INSERT INTO results (userid,level,rightAnswers,wrongAnswers) values ($1::text,$2,$3,$4)', values:[]})
    }
    async getUserAverageLevel(login) {
        var { rows } = await client.query({ text: 'SELECT round(AVG(level)) as al FROM results WHERE userid=$1::text', values: [login] })
        return rows
    }
    async getRandomQuestion(al, testedSet) {
        var tst = ''
        var tested = Array.from(testedSet)
        if (tested.length > 0) {
            tst = 'AND questID != ALL (ARRAY ['
            tested.forEach(el => {
                tst += el + ','
            })
            tst = tst.slice(0, -1)
            tst += '])'
        }
        //console.log(tst)
        //console.log(al)
        var { rows } = await client.query({ text: 'SELECT questID,question,cases,type FROM questions WHERE level=$1' + tst + 'AND delted=false ORDER BY random() LIMIT 1', values: [al] })
        return rows
    }
    async checkQuestion(questID, answer) {
        var { rows } = await client.query({ text: 'SELECT answer FROM questions WHERE questID=$1', values: [questID] })
        var res = { isRight: false, rightAnswer: rows[0].answer }  //isright -правильно ответил? rightanswer - правильный ответ
        if (res.rightAnswer === answer)
            res.isRight = true
        return res
    }
    /* #endregion */
    /* #region  Модуль авторизации */
    async addUser(login, password) {
        var registered = true
        try {
            await client.query({
                text: 'INSERT INTO users (login,password) values ($1::text,$2::text)',
                values: [login, password]
            })
        } catch (err) {
            registered = false
        }
        return registered
    }
    async checkLogin(login, password) {
        var { rows } = await client.query({
            text: 'SELECT role,login FROM users WHERE $1::text=login AND $2::text=password',
            values: [login, password]
        })
        //var r1=await client.query("select * from test");
        //console.log(r1.rows);
        return rows
    }
    /* #endregion */
    /* #region  Модуль редактирования */
    async deleteQuestion(id, delted) {
        var undel = !!delted
        client.query({ text: 'UPDATE questions SET delted=$2 WHERE questID=$1', values: [id, undel] })
    }
    async getQuestion(id) {
        var { rows } = await client.query({ text: 'SELECT * FROM questions WHERE questID=$1', values: [id] })
        return rows;
    }
    async addOrChangeQuestion(id, quest, type, answer, cases = '') {
        console.log(id)
        var { rows } = await client.query({ text: 'SELECT questID FROM questions WHERE $1=questID', values: [id] })
        if (rows.length > 0) {
            client.query({ text: 'UPDATE questions SET type=$1::text,question=$2::text,cases=$3::text,answer=$4::text WHERE questID=$5', values: [type, quest, cases, answer, id] })
        } else {//Пока только обноваление
            //client.query({text: 'INSERT INTO questions SET type=$1::text,question=$2::text,cases=$3::text,answer=$4::text WHERE questID=$5',values:[type,quest,cases,answer,id]})
        }
    }
    async getQuestionThemes(type = 'all') {     //Получаю темы из таблицы
        var res
        if (type !== 'all')
            res = await client.query({ text: "SELECT DISTINCT theme FROM questions WHERE type=$1", values: [type] })
        else {
            res = await client.query({ text: "SELECT DISTINCT theme FROM questions" })
        }
        var { rows } = res
        return rows
    }
    async getThemeQuestions(theme, type, delted) {
        var res
        if (type === 'all')
            res = await client.query({ text: "SELECT * FROM questions WHERE $1::text=theme AND delted=$2", values: [theme, delted] })
        else
            res = await client.query({ text: "SELECT * FROM questions WHERE $1::text=theme AND type=$2::text AND delted=$3", values: [theme, type, delted] })
        var { rows } = res
        return rows
    }
    async addQuestion(type, theme, level, quest, cases, answer) {  //Добавляю вопросы в таблицу
        /*client.query({
            text: 'INSERT INTO questions (type,theme,level,question,cases,answer) values ($1::text,$2::text,$3,$4::text,$5::text,$6::text)',
            values: [type, theme, level, quest, cases, answer]
        }, (err, res) => {
            if (err) {
                if (err.constraint !== 'questions_question_key') {
                    console.log(err)
                }
            }

        })*/
        await client.query({
            text: "select addQuest($1::text,$2::text,$3,$4::text,$5::text,$6::text)",
            values: [type, theme, level, quest, cases, answer]
        }, (err, res) => { })
    }
    async customGet(request) {
        return await client.query(request)
    }
    async customAdd(request) {
        client.query(request)
    }
    /* #endregion */
}
module.exports.myPg = myPg