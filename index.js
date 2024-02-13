const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Sequelize = require('sequelize');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
// const session = require('express-session');
const jwt_decode = require('jwt-decode');
// const fileUpload = require('express-fileupload');
const { DataTypes } = require('sequelize');

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/imgprofile', express.static('imgprofile'));
app.use('/albumworkings', express.static('albumworkings'));
app.use('/product', express.static('product'));
// app.use(bodyParser.json());
// app.use(fileUpload());
app.use(bodyParser.urlencoded({extended:false}))


const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

// โมเดลผู้ใช้
const User = sequelize.define(
  "users",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    firstname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// โมเดลโปรไฟล์ช่างภาพ
const PhotographerVerify = sequelize.define(
  "photographer_verify",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: 'id',
        onDelete: 'CASCADE', // เพิ่มคำสั่ง onDelete ที่เป็น 'CASCADE'
      },
      allowNull: false,
    },
    fullName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    birthdate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    lineId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    idCardNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    imgCardId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    imgFace: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);


// โปรไฟล์ผู้ว่าจ้าง
const EquipmentRentalVerify = sequelize.define(
  "equipment_rental_verify",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: 'id',
        onDelete: 'CASCADE', // เพิ่มคำสั่ง onDelete ที่เป็น 'CASCADE'
      },
      allowNull: false,
    },
    fullName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    birthdate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    lineId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    idCardNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    imgCardId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    imgFace: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

const workings = sequelize.define("workings",{
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'id',
      onDelete: 'CASCADE', // เพิ่มคำสั่ง onDelete ที่เป็น 'CASCADE'
    },
    allowNull: false,
  },
  work_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  image_path: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const products = sequelize.define("products",{
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'id',
      onDelete: 'CASCADE', // เพิ่มคำสั่ง onDelete ที่เป็น 'CASCADE'
    },
    allowNull: false,
  },
  product_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  price: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imgProduct: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// User.hasMany(EquipmentRentalVerify);
// EquipmentRentalVerify.belongsTo(User);


const reviews = sequelize.define("reviews", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  rating: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'id',
      onDelete: 'CASCADE', // เพิ่มคำสั่ง onDelete ที่เป็น 'CASCADE'
    },
    allowNull: false,
  },
  equipment_rental_profile_id: {
    type: Sequelize.INTEGER,
    foreignKey: {
      references: {
        table: "photography_equipment_rental_profile",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    allowNull: true,
  },
  photographer_profile_id: {
    type: Sequelize.INTEGER,
    foreignKey: {
      references: {
        table: "photographer_profile",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    allowNull: true,
  },
});


const PhotographerProfile = sequelize.define(
  "photographer_profile",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: 'id',
        onDelete: 'CASCADE', 
      },
      allowNull: false,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    about: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lineId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Facebook: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Instagram: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    selectedOptions: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    selectedOptions2: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    imgProfile: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

const RentEquipmentProfile = sequelize.define(
  "RentEquipment_profile",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: 'id',
        onDelete: 'CASCADE', // เพิ่มคำสั่ง onDelete ที่เป็น 'CASCADE'
      },
      allowNull: false,
    },
    provinc: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    line_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    facebook: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    instgram: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tel: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image_profile: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);


// sequelize.sync();

const storageworkings = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'albumworkings/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + ".jpg")
  }
})

const uploadworkings = multer({ storage: storageworkings })

const storageprofile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'imgprofile/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + ".jpg")
  }
})

const uploadprofile = multer({ storage: storageprofile })

const storageverify = multer.diskStorage({
  destination: function (req, file, cb) {
    // กำหนดโฟลเดอร์ตามชื่อ field
    if (file.fieldname === 'imgFace') {
      cb(null, 'imgface/');
    } else if (file.fieldname === 'imgCardId') {
      cb(null, 'imgcard/');
    } else {
      cb(new Error('Invalid fieldname'));
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + ".jpg")
  },
});

const uploadverify = multer({ storage: storageverify });

const storageproduct = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'product/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + ".jpg")
  }
})

const uploadproduct = multer({ storage: storageproduct })

// const verifyToken = (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) return res.status(401).send('Access Denied');

//   try {
//     const decoded = jwt_decode(token);
//     console.log("Decoded Token:", decoded);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(400).send('Invalid Token');
//   }
// };

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};

// Middleware to check if the user has a specific role
const checkUserRole = (role) => {
  return (req, res, next) => {
    if (req.user.role === role) {
      next(); // ผู้ใช้มีบทบาทตามที่ต้องการ
    } else {
      res.status(403).json({ error: 'Access denied. You do not have the required role.' });
    }
  };
};

const users = [];

app.post('/api/uploadworkings',authenticateToken, uploadworkings.array('file', 12), async function (req, res, next) {
  try {

    const files = req.files;
    const { work_name, description } = req.body;

    // ตรวจสอบว่ามีไฟล์ถูกอัพโหลดหรือไม่
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }
    const user_id = req.user.id;
    // ทำการเก็บข้อมูลลงในฐานข้อมูล
    const fileNames = files.map(file => file.filename);
    const createdWork = await workings.create({
      work_name: work_name,
      description: description,
      image_path: fileNames.join(', '), // สามารถเปลี่ยนวิธีเก็บไฟล์ได้ตามความต้องการ
      user_id: user_id,
    });

    res.status(201).json({ success: true, work: createdWork });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/uploadproduct',authenticateToken, uploadproduct.array('file', 4), async function (req, res, next) {
  try {

    const files = req.files;
    const { product_name , category, description , price ,  } = req.body;

    // ตรวจสอบว่ามีไฟล์ถูกอัพโหลดหรือไม่
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }
    const user_id = req.user.id;
    // ทำการเก็บข้อมูลลงในฐานข้อมูล
    const fileNames = files.map(file => file.filename);
    const createdProduct = await products.create({
      product_name: product_name,
      category: category,
      description: description,
      price: price ,
      imgProduct: fileNames.join(', '), // สามารถเปลี่ยนวิธีเก็บไฟล์ได้ตามความต้องการ
      user_id: user_id,
    });

    res.status(201).json({ success: true, product: createdProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getworkings/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch workings data for the specific user
    const userWorkings = await workings.findAll({
      where: {
        user_id: userId,
      },
    });

    // If no workings found for the user
    if (!userWorkings || userWorkings.length === 0) {
      return res.status(404).json({ error: 'No workings found for the user.' });
    }

    // Create an array to store workings with image URLs
    const workingsWithImages = userWorkings.map(work => {
      const imagePaths = work.image_path.split(',').map(path => path.trim());
      const imageUrls = imagePaths.map(imagePath => `${req.protocol}://${req.get('host')}/albumworkings/${imagePath}`);
      return {
        ...work.dataValues,
        imageUrls,
      };
    });

    // Return the data and image URLs
    res.status(200).json({ workings: workingsWithImages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getproducts/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch workings data for the specific user
    const userProducts = await products.findAll({
      where: {
        user_id: userId,
      },
    });

    // If no workings found for the user
    if (!userProducts || userProducts.length === 0) {
      return res.status(404).json({ error: 'No products found for the user.' });
    }

    // Return the data and image URLs
    res.status(200).json({ Products: userProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// แก้ไข endpoint สำหรับการสร้างโปรไฟล์
app.post('/api/accountprofile',authenticateToken,uploadprofile.single('imgProfile'), async (req, res) => {
  try {
    const user_id = req.user.id;
    const { username, about, lineId, Facebook, Instagram, selectedOptions, selectedOptions2  } = req.body;
    const imgProfile = req.file.filename;
    // Save the form data to the database
    const NewPhotographerProfile = await PhotographerProfile.create({
      username,
      about,
      lineId,
      Facebook,
      Instagram,
      selectedOptions,
      selectedOptions2,
      imgProfile,
      user_id : user_id,

    });

    // Respond with a success message
    res.status(201).json({ message: 'Form data saved successfully', PhotographerProfile: NewPhotographerProfile });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/getAllPhotographerProfiles', authenticateToken, async (req, res) => {
  try {
    // Find all PhotographerProfiles
    const photographerProfiles = await PhotographerProfile.findAll();

    if (!photographerProfiles) {
      return res.status(404).json({ error: 'PhotographerProfiles not found' });
    }

    // สร้าง URL สำหรับรูปภาพและเพิ่มในข้อมูลทุกๆโปรไฟล์
    const profilesWithImageURLs = photographerProfiles.map(profile => ({
      ...profile.dataValues,
      imgProfileURL: `${req.protocol}://${req.get('host')}/imgprofile/${profile.imgProfile}`,
    }));

    // ส่งข้อมูล PhotographerProfiles พร้อม URL รูปภาพกลับ
    res.status(200).json({ photographerProfiles: profilesWithImageURLs });
  } catch (error) {
    console.error('Error fetching PhotographerProfiles data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// app.post('/api/accountprofile', authenticateToken, async (req, res) => {
//   try {
//     const user_id = req.user.id;
//     const { username, about, lineId, Facebook, Instagram, selectedOptions, selectedOptions2, imgProfile } = req.body;

//     // Check if there is an existing PhotographerProfile for the user_id
//     const existingProfile = await PhotographerProfile.findOne({
//       where: { user_id: user_id },
//     });

//     if (existingProfile) {
//       // If there is an existing profile, respond with an error message
//       return res.status(400).json({ error: 'Profile already exists for this user' });
//     }

//     // Save the form data to the database
//     const newPhotographerProfile = await PhotographerProfile.create({
//       username,
//       about,
//       lineId,
//       Facebook,
//       Instagram,
//       selectedOptions,
//       selectedOptions2,
//       imgProfile,
//       user_id: user_id,
//     });

//     // Respond with a success message
//     res.status(201).json({ message: 'Form data saved successfully', photographerProfile: newPhotographerProfile });
//   } catch (error) {
//     console.error('Error saving form data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


app.post("/api/VerifyPhotograhper", authenticateToken, uploadverify.fields([{ name: 'imgFace', maxCount: 1 }, { name: 'imgCardId', maxCount: 1 }]), async (req, res) => {
  try {
    const user_id = req.user.id;
    // Extract data from the request body and multer file objects
    const { fullName, email, birthdate, lineId, address, idCardNumber , status } = req.body;
    const imgFace = req.files['imgFace'][0].filename;
    const imgCardId = req.files['imgCardId'][0].filename;

    // Create a new user record in the database
    const newPhotographerVerify = await PhotographerVerify.create({
      user_id: user_id,
      fullName,
      email,
      birthdate,
      lineId,
      address,
      idCardNumber,
      imgCardId,
      imgFace,
      status: "pending",
      // Add other fields here based on your data model
    });

    // Respond with a success message and the created user
    res.status(201).json({ message: "Data submitted successfully", PhotographerVerify: newPhotographerVerify });
  } catch (error) {
    console.error("Error submitting data:", error);
    // Handle errors and respond with an error message
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/VerifyRent", authenticateToken, uploadverify.fields([{ name: 'imgFace', maxCount: 1 }, { name: 'imgCardId', maxCount: 1 }]), async (req, res) => {
  try {
    const user_id = req.user.id;
    // Extract data from the request body and multer file objects
    const { fullName, email, birthdate, lineId, address, idCardNumber , status } = req.body;
    const imgFace = req.files['imgFace'][0].filename;
    const imgCardId = req.files['imgCardId'][0].filename;

    // Create a new user record in the database
    const newEquipmentRentalVerify = await EquipmentRentalVerify.create({
      user_id: user_id,
      fullName,
      email,
      birthdate,
      lineId,
      address,
      idCardNumber,
      imgCardId,
      imgFace,
      status: "pending",
      // Add other fields here based on your data model
    });

    // Respond with a success message and the created user
    res.status(201).json({ message: "Data submitted successfully", EquipmentRentalVerify: newEquipmentRentalVerify });
  } catch (error) {
    console.error("Error submitting data:", error);
    // Handle errors and respond with an error message
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get('/api/getPhotographerProfile', authenticateToken, async (req, res) => {
  try {

    // Find PhotographerProfile based on user_id
    const photographerProfile = await PhotographerProfile.findAll();

    if (!photographerProfile) {
      return res.status(404).json({ error: 'PhotographerProfile not found' });
    }

    // Respond with PhotographerProfile data
    res.status(200).json({ photographerProfile });
  } catch (error) {
    console.error('Error fetching PhotographerProfile data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getaccount', async (req, res) => {
  try {
    // ดึงข้อมูลผู้ใช้ที่ผ่านการ verify จากตาราง photographer_verify
    const accountuser = await PhotographerProfile.findAll();

    // สร้างอาร์เรย์เพื่อเก็บข้อมูลผู้ใช้พร้อมทั้งข้อมูลรูปภาพ
    const usersWithImages = [];

    // วนลูปเพื่อดึงข้อมูลรูปภาพตาม user_id
    for (const user of accountuser) {
      const imagePath = `C:\\Users\\User\\Desktop\\testuploadimg\\imgprofile${user.imgProfile}`;

      // เพิ่มข้อมูลรูปภาพลงใน user object
      const userWithImage = {
        ...user.toJSON(),  // คัดลอกข้อมูลผู้ใช้
        imagePath: path.resolve(imagePath),  // แปลงเป็นเส้นทางแบบเต็ม
      };

      // เพิ่ม user object ที่มีข้อมูลรูปภาพลงในอาร์เรย์
      usersWithImages.push(userWithImage);
    }

    // ส่งข้อมูลผู้ใช้พร้อมข้อมูลรูปภาพกลับไปยัง React App ในรูปแบบ JSON
    res.json(usersWithImages);
  } catch (error) {
    console.error('Error fetching verified users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getVerifiedUsers', async (req, res) => {
  try {
    // ดึงข้อมูลผู้ใช้ที่ผ่านการ verify จากตาราง photographer_verify
    const verifiedUsers = await PhotographerVerify.findAll();

    // แปลงข้อมูลรูปภาพจาก BLOB เป็น base64 string
    const usersWithBase64Image = verifiedUsers.map(user => {
      const base64Image = user.imageProfile ? user.imageProfile.toString('base64') : null;
      return { ...user.toJSON(), imageProfile: base64Image };
    });

    // ส่งข้อมูลกลับไปยัง React App ในรูปแบบ JSON
    res.json(usersWithBase64Image);
  } catch (error) {
    console.error('Error fetching verified users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to register a new user
app.post('/registerforuser', async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
      return res.status(400).json({ error: 'อีเมลนี้มีอยู่แล้ว' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstname, lastname, email, password: hashedPassword, role: 'user' });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to register a new manager
app.post('/registerforphoto', async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
      return res.status(400).json({ error: 'อีเมลนี้มีอยู่แล้ว' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const photo = await User.create({ firstname, lastname, email, password: hashedPassword, role: 'photo' });
    res.status(201).json(photo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to register a new rent 
app.post('/registerforrent', async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
      return res.status(400).json({ error: 'อีเมลนี้มีอยู่แล้ว' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const rent = await User.create({ firstname, lastname, email, password: hashedPassword, role: 'rent' });
    res.status(201).json(rent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Route for user login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(400).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) return res.status(400).json({ error: 'รหัสผ่านไม่ถูกต้อง' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.SECRET_KEY, { expiresIn: '24h' });
    res.header('Authorization', token).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Protected route for photos
app.get('/photos', authenticateToken, async (req, res) => {
  try {
    const photos = await User.findAll({ where: { role: 'photo' } });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/photographer_verifies', authenticateToken, checkUserRole('photo'), async (req, res) => {
  try {
    // Query all photographer verifies
    const photographerVerifies = await PhotographerVerify.findAll();

    // Respond with the data
    res.json(photographerVerifies);
  } catch (error) {
    // Handle errors and respond with an error message
    res.status(500).json({ error: error.message });
  }
});

// Protected route for rent
app.get('/rent', authenticateToken, async (req, res) => {
  try {
    const rent = await User.findAll({ where: { role: 'rent' } });
    res.json(rent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/getPhotographerProfile/:id', authenticateToken, async (req, res) => {
  try {
    // Find PhotographerProfile by ID
    const photographerProfile = await PhotographerProfile.findByPk(req.params.id);

    if (!photographerProfile) {
      return res.status(404).json({ error: 'PhotographerProfile not found' });
    }

    // Create URL for the profile image
    const profileWithImageURL = {
      ...photographerProfile.dataValues,
      imgProfileURL: `${req.protocol}://${req.get('host')}/imgprofile/${photographerProfile.imgProfile}`,
    };

    // Send PhotographerProfile data with image URL back
    res.status(200).json({ photographerProfile: profileWithImageURL });
  } catch (error) {
    console.error('Error fetching PhotographerProfile data by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/api/photographer/:id', authenticateToken , async (req, res) => {
  try {
    const { id } = req.params;

    // ดึงข้อมูลผู้ใช้ที่ตรงกับ id จากตาราง photographer_verify
    const photographer = await PhotographerProfile.findOne({ where: { id } });

    // ตรวจสอบว่าพบข้อมูลผู้ใช้หรือไม่
    if (!photographer) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลผู้ใช้' });
    }

    const imgProfileURL = `${req.protocol}://${req.get('host')}/imgface/${photographer.imgProfile}`;

    // ส่งข้อมูล PhotographerProfile พร้อม URL รูปภาพกลับ
    res.status(200).json({ photographer, imgProfileURL });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Protected route for getting a specific photo by ID
app.get('/photographer/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const photographer = await PhotographerProfile.findOne({ where: { id } });

    if (!photographer) {
      return res.status(404).json({ error: 'ไม่พบช่างภาพ' });
    }

    // ตรวจสอบว่ามีรูปภาพหรือไม่
    const imgPath = `C:\\Users\\User\\Desktop\\React-TailwindCSS-Front-main\\public\\img_profile${photographer.imgProfile}`;

    // เพิ่ม URL ของรูปภาพใน JSON response
    const photographerWithImage = {
      ...photographer.toJSON(),
      imgProfileUrl: imgPath,
    };

    res.json(photographerWithImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/rent/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rent = await User.findOne({ where: { id, role: 'rent' } });

    if (!rent) {
      return res.status(404).json({ error: 'ไม่พบผู้ให้เช่าอุปกรณ์' });
    }

    res.json(rent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  sequelize.sync({ force: false }).then(() => {
  console.log("Database synced");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
