import SibApiV3Sdk from '@getbrevo/brevo';

const sendVerificationCode = (to, code) => {
    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    let apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = "{{params.subject}}";
    sendSmtpEmail.htmlContent = `<html><body><h1>Your verification code is {{params.parameter}}</h1></body></html>`;
    sendSmtpEmail.sender = { "name": "Coşğun Babayev", "email": "coshgunbabayevw13@gmail.com" };
    sendSmtpEmail.to = [{ "email": to }];
    sendSmtpEmail.headers = { "Some-Custom-Name": "unique-_id-1234" };
    sendSmtpEmail.params = { "parameter": code, "subject": "Verification code" };

    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
    }, function (error) {
        console.error(error);
    });
};

export {
    sendVerificationCode
};