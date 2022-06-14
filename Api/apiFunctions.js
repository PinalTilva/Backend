

const getFun = async ({ req, res, dbData }) => {
    let data = await dbData();
    data = await data.find().toArray();
    res.send(data);
}

const getMembers = async ({ req, res, dbData, dbMembers }) => {

    let data = await dbData();
    let data1 = await dbMembers();
    let members2 = [];
    let members1 = [];
    let loanNumber = [];
    data = await data.find().toArray();
    data1 = await data1.find().toArray();
    await data1.map((elem) => {
        members1.push(...elem.name);
    })
    let obj = {};
    await data.map((month) => {
        month.loan && Object.entries(month.loan).map((loan) => {
            loanNumber.push(+loan[1].loanId.substring(9) + 1);
            if (loan[1]['End'] === "Running") {
                obj[loan[0]] = {};
                obj[loan[0]].amount = (loan[1]['Amount'] / 100);
                obj[loan[0]].loanId = loan[1].loanId;
            }
        });
        if (month['year'] === req.params.year) {
            Object.keys(month['interest']).map((mem) => {
                delete obj[mem];
            })
        }
    });
    let loanCount = ("000" + loanNumber.slice(-1).pop()).slice(-4);
    members2.push(obj);
    res.send({ members1, members2, loanCount });
};

const create = async ({ req, res, dbData }) => {
    let data = await dbData();
    let finalData = req.body;
    let result = await data.insert(req.body);
    res.send(result);
};

const updateYear = async ( req, res, dbData ) => {
    console.log( 'hiiii', req.body);
    let data = await dbData();
    if (Object.keys(req.body).includes("interest")) {
        let name = Object.keys(req.body.interest)[0];
        let name1 = 'interest.' + name;
        let obj1 = {};
        obj1[name1] = req.body['interest'][name];
        let result = data?.updateOne(
            { year: req.params.year },
            { $set: obj1 }
        )

    } else {
        let name = Object.keys(req.body.loan)[0];
        let name1 = 'loan.' + name;
        let obj1 = {};
        obj1[name1] = req.body['loan'][name];
        let result = data?.updateOne(
            { year: req.params.year },
            { $set: obj1 }
        )
    }
    res.send('Updated successfully...');
};

const deleteLoans = async ({ req, res, dbData }) => {
    let data = await dbData();
    let obj = {};
    let name = 'loan.' + req.body.row.name;
    obj[name] = {};
    obj[name]['loanId'] = req.body.row.loanId;
    let result = data.updateOne(
        { year: req.body.row.year },
        { $unset: obj }
    );
    res.send('Deleted successfully...');
}

const updateLoans = async ({ req, res, dbData }) => {
    console.log(req.body);
    let data = await dbData();
    let obj1 = {};
    let name1 = 'loan.' + req.body[0] + '.End';
    let name2 = 'loan.' + req.body[0] + '.Settled';
    let amount = req.body[1]['Amount'];
    let year = new Date();

    if (req.body.includes('Settled')) {
        let final = {};
        final[year.toISOString().slice(0, 10)] = amount;
        obj1[name2] = final;
        res.status(200).send('Updated Successfully ...');
    } else {
        obj1[name1] = year.toISOString().slice(0, 10);
        res.status(200).send('Updated Successfully ...');
    };

    let result = data.updateOne(
        { year: req.body[2] },
        { $set: obj1 }
    )
};

//middleware
const Middleware = (req, res, next) => {
    console.log(req.body);
    let date = new Date();
    let string = date.toString().slice(0, 18).concat("banc");
    String.prototype.hashCode = function () {
        var hash = 0, i, chr;
        if (this.length === 0) return hash;
        for (i = 0; i < this.length; i++) {
            chr = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };
    let code = string.hashCode();
    let headToken = req.headers['authorization'];
    if ('Funds11'.concat(code) === headToken) {
        next();
    } else {
        res.send('Request timeout, please re-login ...')
    }
};

const loginApi = async ({ req, res, login }) => {
    let date = new Date();
    let data = await login();
    data = await data.find().toArray();
    let string = date.toString().slice(0, 18).concat("banc");
    String.prototype.hashCode = function () {
        var hash = 0, i, chr;
        if (this.length === 0) return hash;
        for (i = 0; i < this.length; i++) {
            chr = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };

    if (req.body.admin === data[0].admin && req.body.password === data[0].password) {
        res.send({
            "user": data[0].user,
            "code": string.hashCode()
        });
    } else {
        res.status(404).send('Wrong credentials given ...');
    }
}

module.exports = {
    getFun, getMembers, updateYear, create, updateLoans, loginApi, deleteLoans, Middleware
};