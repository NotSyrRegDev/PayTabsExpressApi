require('dotenv').config();
var request = require('request');
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');


app.use(bodyParser.urlencoded( { extended: true } ));
app.use(bodyParser.json());
app.use(cors());




router.get('/' , (req , res) => {
    res.json({
        hello: "hi!"
      });
});

router.post('/payment' , cors() , (req , res) => {
  
    const { name , email , phone , amount } = req.body;
   // const { name , email , phone , amount , card_number , expire_month , expire_year , cvv_card } = req.body;

    request.post(
        {
        url:`${process.env.DOMAIN}/payment/request`,
        json: {
            "profile_id": `${process.env.PROFILE_ID}`,
            "tran_type": "sale",
            "tran_class": "ecom",
            "cart_id": `${process.env.CARTID}`,
            "cart_currency": "SAR",
            "cart_amount": amount,
            "cart_description": "عملية الشراء من قولدن كورس",
            "paypage_lang": "ar",
            "customer_details": {
                "name": name,
                "email": email,
                "phone": phone,
                "street1": "address street",
                "city": "riyadh",
                "state": "sa",
                "country": "SAR",
                "zip": "12345",
                "ip": "1.1.1.1"
            },
    //          "shipping_details": {
    //     "name": "wajih last1",
    //     "email": "wajih@domain.com",
    //     "phone": "971555555555",
    //     "street1": "street2",
    //     "city": "dubai",
    //     "state": "dubai",
    //     "country": "AE",
    //     "zip": "54321",
    //     "ip": "2.2.2.2"
    // },

    //         "card_details": {
    //             "pan": card_number,
    //             "expiry_month": expire_month,
    //             "expiry_year": expire_year,
    //             "cvv": cvv_card,
    //         },

            "hide_shipping": true,
            "callback": `${process.env.CALLBACK}`,
            "return": `${process.env.CALLBACK}`
            },
            headers: {
                'authorization' : `${process.env.SERVER_KEY}`,
                'Content-Type': 'application/json',
               
                'Accept': '*/*',
                'Access-Control-Allow-Origin': '*',
            }
        },
      function(error, response, body){
         
        res.send(body);
      });

 });

 app.use(`/.netlify/functions/api`, router);



 module.exports = app;
 module.exports.handler = serverless(app);