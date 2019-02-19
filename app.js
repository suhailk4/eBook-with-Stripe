const express=require('express');
const keys=require('./config/keys.js')
const stripe=require('stripe')(keys.stripeSecretKey);
const bodyparser=require('body-parser');
const hbs=require('express-handlebars');
const app=express();


app.engine('handlebars',hbs({defaultLayout:'main'}));
app.set('view engine','handlebars');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));




var port=process.env.PORT || 3000;

app.use(express.static(__dirname +'/public'));

app.get('/',(req,res)=>{

        res.render('index',{
          stripePublishableKey:keys.stripePublishableKey

        });


});

// app.get('/charge',(req,res)=>{
//
//  res.render('success');
//
// });


app.post('/charge',(req,res)=>{


               const amount=5000;

               stripe.customers.create({

               email:req.body.stripeEmail,
               source:req.body.stripeToken

             }).then((customer)=>{

                      return     stripe.charges.create({

                                   amount:amount,
                                   customer:customer.id,
                                   currency:'usd',
                                   description:'eBook Web App'
                          })



             }).then((charges)=>{

                          return   res.render('success');

             })



});




app.listen(port,()=>{
  console.log(`Server is up on ${port}`);
});
