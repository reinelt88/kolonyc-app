import * as functions from 'firebase-functions';

const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kolonyc.app@gmail.com',
        pass: 'Diago200212'
    }
});

export const paymentSendMail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {

        // const dest = req.query.dest;
        const dest = req.body.email;

        const mailOptions = {
            from: 'Info Kolonyc <noreply@kolonyc.com>',
            to: dest,
            subject: 'Nuevo pago de mensualidad realizado', // email subject
            html: `<p style="font-size: 16px;">Nuevo pago realizado por la casa/departamento ` + req.body.house + ` con el monto de $` + req.body.quantity + `</p>
            <p>Datos</p>
            <p><strong>Tipo: </strong>` + req.body.type + `</p>
            <p><strong>Número de referencia: </strong>` + req.body.referenceNumber + `</p>
            <p><strong>Mes/Año: </strong>` + req.body.month + `/` + req.body.year + `</p>
            <p><strong>Notas: </strong>` + req.body.notes + `</p>
            <p><strong>Evidencia: </strong>` + req.body.evidence + `</p>
            <br />
            <p style="font-size: 10px;">Este correo electrónico fue generado a través un sistema automatizado, por favor no responda el mismo, </p>
            <p style="font-size: 10px;">Equipo de Kolonyc.</p>
                <br />
                <img src="https://firebasestorage.googleapis.com/v0/b/colonyc-14f60.appspot.com/o/logo.png?alt=media&token=bae38732-d26f-4f7b-9c85-1dd7fc578315" style="margin: 0 auto;" />
            ` // email content in HTML
        };

        return transporter.sendMail(mailOptions, (erro: any) => {
            if (erro) {
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });
});

export const paymentStatusSendMail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {

        // const dest = req.query.dest;
        const dest = req.body.email;

        const mailOptions = {
            from: 'Info Kolonyc <noreply@kolonyc.com>',
            to: dest,
            subject: 'Estado de pago actualizado', // email subject
            html: `<p style="font-size: 16px;">El administrado de la colonia ha actualizado el estado del pago del ` + req.body.month + `/` + req.body.year + ` a ` + req.body.status + `</p>
            <p>Datos</p>
            <p><strong>Tipo: </strong>` + req.body.type + `</p>
            <p><strong>Número de referencia: </strong>` + req.body.referenceNumber + `</p>
            <p><strong>Mes/Año: </strong>` + req.body.month + `/` + req.body.year + `</p>
            <p><strong>Notas: </strong>` + req.body.notes + `</p>
            <p><strong>Evidencia: </strong>` + req.body.evidence + `</p>
            <br />
            <p style="font-size: 10px;">Este correo electrónico fue generado a través un sistema automatizado, por favor no responda el mismo, </p>
            <p style="font-size: 10px;">Equipo de Kolonyc.</p>
                <br />
                <img src="https://firebasestorage.googleapis.com/v0/b/colonyc-14f60.appspot.com/o/logo.png?alt=media&token=bae38732-d26f-4f7b-9c85-1dd7fc578315" style="margin: 0 auto;" />
            ` // email content in HTML
        };

        return transporter.sendMail(mailOptions, (erro: any) => {
            if (erro) {
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });
});

export const helloWorld = functions.https.onRequest((request, response) => {
    response.send('Hello from Firebase!');
});
