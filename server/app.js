import express from 'express'
import mongoose, { mongo } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import llamaService from './llamaService.js';
import dotenv from 'dotenv'
import cors from 'cors'
//URI
const MONGO_URI = process.env.MONGO_URI
//Initialisation
const app = express()

//Load env variables
dotenv.config()
const PORT = process.env.PORT

//Middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ['http://localhost:5173','https://rectify-ai-powered-healthcare.onrender.com' ],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true
}))

//Authentication middleware
const authMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if (!token) {
            return res.status(401).json({ error: "Token not found" })
        }
        const decoded = jwt.verify(token, "monumentalkattar")
        const doctor = await Doctor.findById(decoded.id)
        if (!doctor) {
            throw new Error("Doctor not found")
        }
        req.doctor = doctor
        next()
    } catch (err) {
        console.log("Authentication Error", err.message);
        res.status(401).json({ error: "Please authenticate" })
    }
}

//Mongodb connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('DB Connected'))
    .catch((err) => console.log('DB not connected'))

//Doctor Schema
const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    specialization: String,
    phoneNumber: String,
    createdAt: { type: Date, default: Date.now }
})

//Patient Schema
const patientSchema = new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    doctorName: { type: String },
    name: { type: String, required: true },
    age: Number,
    contactNumber: String,
    address: String,
    gender: String,
    medicalHistory: [{
        condition: String,
        diagnosis: String,
        medication: [{
            name: String,
            dosage: String,
            frequency: String,
            notes: String,
        }],
        diagnosedDate: { type: Date, default: Date.now },
    }],
    vitals: [{
        bloodPressure: String,
        heartRate: String,
        temperature: String,
        date: { type: Date, default: Date.now },
        AdditionalReadings: [String]
    }],
    nextAppointment: Date,
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
})

// Task Schema
const taskSchema = new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    task: String,
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now() }
})

//Online-Appointment Visitor Schema
const visitorSchema = new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    name: { type: String, required: true },
    age: Number,
    gender: String,
    contactNumber: { type: String, required: true },
    appointmentDate: Date,
    timing: String,
    address: String,
    createdAt: { type: Date, default: Date.now() }
})

//Middleware for 'pre' saving doctor's name
patientSchema.pre("save", async function (next) {
    if (this.isNew || this.isModified("doctor")) {
        const doctor = await mongoose.model("Doctor").findById(this.doctor);
        if (doctor) {
            this.doctorName = doctor.name;  // Automatically store doctor's name
        }
    }
    next();
});

//Models for Schema
const Doctor = mongoose.model('Doctor', doctorSchema)
const Patient = mongoose.model('Patient', patientSchema)
const Visitor = mongoose.model('Visitor', visitorSchema)
const Task = mongoose.model('Task', taskSchema)


//ROUTES

//Doctor Registration
app.post('/doctors/registration', async (req, res) => {
    try {
        const { name, email, password, specialization, phoneNumber } = req.body

        //Check if Doctor already exists
        const existingDoctor = await Doctor.findOne({ email })
        if (existingDoctor) {
            return res.status(400).json({ error: 'Email already registered' })
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        //Create New Doctor
        const doctor = new Doctor({
            name,
            email,
            password: hashedPassword,
            specialization,
            phoneNumber
        })

        await doctor.save()

        //Generate JWT 
        const token = jwt.sign({ id: doctor._id }, "monumentalkattar")

        res.status(201).cookie("token", token).json({ doctor })

    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

//Doctor Login
app.post('/doctors/login', async (req, res) => {
    try {
        const { email, password } = req.body

        //Find Doctor
        const doctor = await Doctor.findOne({ email })
        if (!doctor) {
            return res.status(400).json({ error: 'Invalid credentials!' })
        }

        //Verify Password
        const isPasswordValid = await bcrypt.compare(password, doctor.password)
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid credentials' })
        }

        //Generate JWT 
        const token = jwt.sign({ id: doctor._id }, "monumentalkattar")

        res.status(201).cookie("token", token, {
            httpOnly: true,
            // sameSite: 'lax',
            sameSite:'none',
            // secure: false,
            secure:true,
            // domain: 'localhost',
            path: '/'
        }).json(doctor)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// Doctor Logout
app.post('/doctors/logout', (req, res) => {
    try {
        res.cookie("token","", {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            domain:'localhost',
            path:'/',
            expires: new Date(0)
        })
        console.log(`Doctor logged out successfully!`)
        res.status(200).json({
            success: true,
            message: 'Logged Out successfully!'
        })
    } catch (err) {
        console.error('Logout error:', err);
        res.status(500).json({
            success: false,
            error: 'Server error during logout'
        });
    }
})

//Patient Appointments
app.get('/patients/contactNumber/:contactNumber', async (req, res) => {
    try {
        const contactNumber = req.params.contactNumber
        const patient = await Patient.find({ contactNumber })
        if (!patient) {
            return res.status(400).json({ error: "No record found" })
        }
        res.status(201).json(patient)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

//Get all doctors
app.get('/patients/bookAppointment/', async (req, res) => {
    try {
        const doctors = await Doctor.find().select('name _id specialization')
        // const doctors = await Doctor.find({},'name _id specialization')
        if (!doctors) {
            return res.status(400).json({ error: "No record Found!" })
        }
        res.status(201).json(doctors)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

//Add new Patient
app.post('/patients/add', authMiddleware, async (req, res) => {
    try {
        const {
            name, age, gender, contactNumber,
            address, medicalHistory, vitals, nextAppointment
        } = req.body

        const patient = new Patient({
            doctor: req.doctor.id,
            name, age, gender, contactNumber,
            address, medicalHistory, vitals, nextAppointment
        })

        await patient.save()
        res.status(201).json(patient)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

//Add a task
app.post('/tasks/add', authMiddleware, async (req, res) => {
    try {
        const { task, status } = req.body;

        const newTask = new Task({
            doctor: req.doctor._id,
            task,
            status
        })
        await newTask.save()
        res.status(201).json(newTask)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

//Get Today's tasks
app.get('/tasks/today', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({
            doctor: req.doctor._id
        })
        // Filter for today
        const today = new Date()
        const todaysTasks = tasks.filter(task => {
            const taskDate = new Date(task.createdAt);
            return (
                taskDate.getDate() === today.getDate() &&
                taskDate.getMonth() === today.getMonth() &&
                taskDate.getFullYear() === today.getFullYear()
            )
        })
        res.status(201).json(todaysTasks)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

//Update a Task
app.patch('/tasks/:id', authMiddleware, async (req, res) => {
    try {
        const updated = req.body
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, doctor: req.doctor._id },
            updated,
            { new: true }
        )
        if (!task) {
            return res.status(400).json({ error: "Task not found!" })
        }
        res.json(task)
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
})

//Add an online appointment visitor
app.post('/visitors/onlineAppointment', async (req, res) => {
    try {
        const {
            doctor, name, age, gender, contactNumber, appointmentDate, address, timing
        } = req.body

        const visitor = new Visitor({
            doctor, name, age, gender, contactNumber, appointmentDate, address, timing
        })

        await visitor.save()
        res.status(201).json(visitor)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// Get all online appointments
app.get("/visitors/all/:doctor", async (req, res) => {
    try {
        const doctor = req.params.doctor
        const visitors = await Visitor.find({ doctor })
        if (!visitors) {
            return res.status(400).json({ error: "No visitor found!" })
        }
        res.status(201).json(visitors)
    } catch (error) {

    }
})

// Get today's appointments
app.get("/visitors/:doctor", async (req, res) => {
    try {
        const doctor = req.params.doctor;

        // Get today's start and end timestamps
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const visitors = await Visitor.find({
            doctor,
            createdAt: {
                $gte: startOfToday,
                $lt: endOfToday
            }
        });

        if (!visitors || visitors.length === 0) {
            return res.status(404).json({ error: "No visitors found for today!" });
        }

        res.status(200).json(visitors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

//Get all Patients for a Doctor
app.post("/patients/all", authMiddleware, async (req, res) => {
    try {
        const patients = await Patient.find({ doctor: req.doctor._id })
        res.json(patients)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

//Get specific Patient
app.get("/patients/:id", authMiddleware, async (req, res) => {
    try {
        const patient = await Patient.findOne({
            _id: req.params.id,
            doctor: req.doctor._id
        })
        if (!patient) {
            return res.status(400).json({ error: "Patient not found!" })
        }

        // console.log(req.doctor.name);
        res.json(patient)

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

//Get Doctor Details
app.get("/doctors/:id", authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id)

        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found!' })
        }
        res.json(doctor)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

//Update patient data
app.patch('/patients/:id', authMiddleware, async (req, res) => {
    try {
        const updates = req.body
        updates.updatedAt = new Date()
        const patient = await Patient.findOneAndUpdate(
            { _id: req.params.id, doctor: req.doctor._id },
            updates,
            { new: true }
        )

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found!' })
        }

        res.json(patient)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

//Update Vital Signs
app.post('/patients/:id/vitals', authMiddleware, async (req, res) => {
    try {
        const patient = await Patient.findOne({
            _id: req.params.id,
            doctor: req.doctor._id
        })

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' })
        }

        patient.vitals.push({
            AdditionalReadings: req.body
        })

        await patient.save()

        res.status(201).json(patient)

    } catch (error) {
        res.status(404).json({ error: err.message })
    }
})


//Route
app.post('/diagnosis', async (req, res) => {
    try {

        const { userPrompt } = req.body;

        //Create a prompt for LLaMA
        const prompt =
            `
            User Message: ${userPrompt}
You are Rectify AI, a medical assistant that helps patients diagnose their symptoms accurately.

You are required to respond strictly in the format below, using structured Markdown formatting (##, **bold**, -, etc.). Match the disease and recommend one of the following doctor types:

1. General Physician - Dr. Tanishq
2. Dermatologist - Dr. Suchita
3. Orthopedic Surgeon - Dr.Mahima
4. ENT Specialist - Dr. Rajat
5. Cardiologist - Dr. Tulsi 

---

Diagnosis

**1. Condition Name**
**2. Definition** 
**3. Severity Level**
**4. Certainty Level**

---

## When to Visit a Doctor
**1. Red Flags**
**2. Timeline**
**3. Importance**

---

## Recommended Doctor Type
- Recommend one of the five provided doctors based on the diagnosed condition.
- Explain why this doctor is best suited to handle it.

---

## Home Remedies
**1. Lifestyle**
**2. Dietary**
**3. Activities** 

---

## Monitoring

**1. Follow-up Timeline**
**2. Warning Signals**

---

If the patient did **not provide symptoms**, respond only with:

Hi, Welcome to Rectify AI
Please describe your symptoms so I can provide a precise medical diagnosis.

            `


        //Call LLaMA API service to generate diagnosis
        const aiResponse = await llamaService(prompt)

        res.send(aiResponse)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
})

//Listening on port
app.listen(PORT, () => {
    console.log('Server is running');

})