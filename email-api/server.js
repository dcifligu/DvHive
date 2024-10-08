require('dotenv').config()
const express = require('express')
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = process.env.PORT
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

// Middleware
app.use(bodyParser.json())
app.use(cors())

// Nodemailer configuration for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // Sender Email
    pass: process.env.PASSWORD // Sender App Password
  }
})

// Endpoint to handle form submission
app.post('/consultation-email', async (req, res) => {
  const { full_name, email, phone, message } = req.body

  const htmlContent = `
  <img src="https://github.com/dcifligu/consultation_images/blob/main/ConsultationFormEmail.png?raw=true" style="width: 700px; height: 300px; display: block; margin: auto;" />
  <table style="width: 700px; margin: auto; height: fit; background-color: white;">
    <tr>
      <td>
        <h1 style="font-size: 18px; font-weight: 500; font-family: Arial, sans-serif;">Name: <span style="font-size: 16px; font-family: Arial, sans-serif;">${full_name}</span></h1>
        <h1 style="font-size: 18px; font-weight: 500; font-family: Arial, sans-serif;">E-mail: <span style="font-size: 16px; font-family: Arial, sans-serif;">${email}</span></h1>
        <h1 style="font-size: 18px; font-weight: 500; font-family: Arial, sans-serif;">Phone: <span style="font-size: 16px; font-family: Arial, sans-serif;">${phone}</span></h1>
        <h1 style="font-size: 18px; font-weight: 500; font-family: Arial, sans-serif;">Message: <span style="font-size: 16px; font-family: Arial, sans-serif;">${message}</span></h1>
      </td>
    </tr>
  </table>
  `

  const mailOptions = {
    from: email,
    to: process.env.RECIPIENT_EMAIL, // Recipient Mail
    subject: 'New Consultation Request',
    priority: 'high',
    html: htmlContent
  }

  try {
    await transporter.sendMail(mailOptions)
    res.status(200).send({ message: 'Email sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).send({ message: 'Failed to send email' })
  }
})

app.post('/intake-email', upload.array('file'), async (req, res) => {
  const formData = req.body
  const files = req.files

  let attachments = files.map((file) => ({
    filename: file.originalname,
    path: file.path
  }))

  const htmlContent = `
  <img src="https://github.com/dcifligu/consultation_images/blob/main/IntakeFormEmail.png?raw=true" style="width: 700px; height: 300px; display: block; margin: auto;" />
  <table style="width: 700px; margin: auto; height: fit; color: #212121; padding: 5px;">
    <tr>
      <td>
      <h1 style="font-size: 18px; font-weight: 500; font-family: Arial, sans-serif;"><strong>Full Name:</strong> <span style="font-size: 16px; font-family: Arial, sans-serif;">${formData.full_name}</span></h1>
      <h1 style="font-size: 18px; font-weight: 500; font-family: Arial, sans-serif;"><strong>Email:</strong> <span style="font-size: 16px; font-family: Arial, sans-serif;">${formData.email}</span></h1>
      <h1 style="font-size: 18px; font-weight: 500; font-family: Arial, sans-serif;"><strong>Phone:</strong> <span style="font-size: 16px; font-family: Arial, sans-serif;">${formData.phone}</span></h1>
      <h1 style="font-size: 18px; font-weight: 500; font-family: Arial, sans-serif;"><strong>Claim Type:</strong> <span style="font-size: 16px; font-family: Arial, sans-serif;">${formData.claimType}</span></h1>
      <h1 style="font-size: 18px; font-weight: 500; font-family: Arial, sans-serif;"><strong>Vehicle Details:</strong> <span style="font-size: 16px; font-family: Arial, sans-serif;">${formData.vehicleYear} ${formData.vehicleMake} ${formData.vehicleModel} ${formData.vehicleTrim}</span></h1>
      <h1 style="font-size: 18px; font-weight: 500; font-family: Arial, sans-serif;"><strong>Mileage:</strong> <span style="font-size: 16px; font-family: Arial, sans-serif;">${formData.vehicleMileage}</span></h1>
      <h1 style="font-size: 18px; font-weight: 500; font-family: Arial, sans-serif;"><strong>Accident Date:</strong> <span style="font-size: 16px; font-family: Arial, sans-serif;">${formData.accidentDate}</span></h1>
      <h1 style="font-size: 18px; font-weight: 500; font-family: Arial, sans-serif;"><strong>State:</strong> <span style="font-size: 16px; font-family: Arial, sans-serif;">${formData.state}</span></h1>
      <h1 style="font-size: 18px; font-weight: 500; font-family: Arial, sans-serif;"><strong>Estimated Repair:</strong> <span style="font-size: 16px; font-family: Arial, sans-serif;">$${formData.estimatedRepair}</span></h1>
      <h1 style="font-size: 18px; font-weight: 500; font-family: Arial, sans-serif;"><strong>Prior Accidents:</strong> <span style="font-size: 16px; font-family: Arial, sans-serif;">${formData.priorAccidents}</span></h1>
      <h1 style="font-size: 18px; font-weight: 500; font-family: Arial, sans-serif;"><strong>Previous Estimated Repair:</strong> <span style="font-size: 16px; font-family: Arial, sans-serif;">$${formData.prevEstimatedRepair}</span></h1>
      <h1 style="font-size: 18px; font-weight: 500; font-family: Arial, sans-serif;"><strong>Leasing:</strong> <span style="font-size: 16px; font-family: Arial, sans-serif;">${formData.leasing}</span></h1>
      <h1 style="font-size: 18px; font-weight: 500; font-family: Arial, sans-serif;"><strong>Insurance:</strong> <span style="font-size: 16px; font-family: Arial, sans-serif;">${formData.insurance}</span></h1>
      <h1 style="font-size: 18px; font-weight: 500; font-family: Arial, sans-serif;"><strong>Fault Insurance:</strong> <span style="font-size: 16px; font-family: Arial, sans-serif;">${formData.faultInsurance}</span></h1>
      <h1 style="font-size: 18px; font-weight: 500; font-family: Arial, sans-serif;"><strong>Message:</strong> <span style="font-size: 16px; font-family: Arial, sans-serif;">${formData.message}</span></h1>
      </td>
    </tr>
  </table>
  `

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.RECIPIENT_EMAIL,
    subject: `New Intake Form: ${formData.full_name}`,
    html: htmlContent,
    attachments: attachments
  }

  try {
    await transporter.sendMail(mailOptions)
    res.status(200).send({ message: 'Email sent successfully!' })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).send({ message: 'Failed to send email.' })
  }
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
