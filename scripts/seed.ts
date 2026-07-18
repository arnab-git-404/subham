/**
 * Seed script for Subham Das Portfolio
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"commonjs","moduleResolution":"node"}' scripts/seed.ts
 *
 * Or add to package.json scripts:
 *   "seed": "ts-node scripts/seed.ts"
 *
 * Prerequisites:
 *   - MONGODB_URI environment variable must be set
 *   - Run `npm install ts-node` if not already installed
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load .env.local
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please set MONGODB_URI environment variable");
  process.exit(1);
}

// Schemas (inline to avoid import issues with ts-node)
const CertificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["Certificate", "Workshop", "Internship", "Award"],
      required: true,
    },
    issuer: { type: String, required: true },
    issueDate: { type: Date, required: true },
    description: { type: String },
    fileUrl: { type: String, required: true },
    filePublicId: { type: String },
    fileType: { type: String, enum: ["image", "pdf"], required: true },
    tags: [String],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const WorkshopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    organizer: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String },
    description: { type: String },
    certificateFileUrl: { type: String },
    skillsGained: [String],
  },
  { timestamps: true }
);

const MessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const AdminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

const ProfileSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    tagline: { type: String },
    bio: { type: String },
    year: { type: String },
    institution: { type: String },
    skills: [String],
    resumeUrl: { type: String },
    socialLinks: {
      linkedin: String,
      github: String,
      instagram: String,
      email: String,
    },
  },
  { timestamps: true }
);

const Certificate =
  mongoose.models.Certificate ||
  mongoose.model("Certificate", CertificateSchema);
const Workshop =
  mongoose.models.Workshop || mongoose.model("Workshop", WorkshopSchema);
const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);
const AdminUser =
  mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);
const Profile =
  mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      Certificate.deleteMany({}),
      Workshop.deleteMany({}),
      Message.deleteMany({}),
      AdminUser.deleteMany({}),
      Profile.deleteMany({}),
    ]);
    console.log("Cleared existing data");

    // Create admin user
    const passwordHash = await bcrypt.hash("admin123", 12);
    await AdminUser.create({
      email: "admin@subhamdas.com",
      passwordHash,
      role: "admin",
    });
    console.log("Created admin user: admin@subhamdas.com / admin123");

    // Create profile
    await Profile.create({
      fullName: "Subham Das",
      tagline: "BMLT Student | Future Medical Lab Technologist",
      bio: "Dedicated 3rd-year Bachelor of Medical Laboratory Technology student with a deep passion for clinical laboratory science. Skilled in hematology, microbiology, and clinical biochemistry.",
      year: "3rd Year BMLT",
      institution: "University of Health Sciences",
      avatarUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      skills: [
        "Hematology",
        "Microbiology",
        "Clinical Biochemistry",
        "Clinical Pathology",
        "Lab Safety Protocols",
        "Equipment Handling",
        "Attention to Detail",
        "Time Management",
        "Team Collaboration",
      ],
      socialLinks: {
        linkedin: "https://linkedin.com/in/subhamdas",
        github: "https://github.com/subhamdas",
        instagram: "https://instagram.com/subhamdas",
        facebook: "https://facebook.com/subhamdas",
        email: "subham.das@email.com",
      },
    });
    console.log("Created profile");

    // Create sample certificates
    const certificates = await Certificate.insertMany([
      {
        title: "Basic Hematology Techniques",
        category: "Certificate",
        issuer: "Indian Association of Medical Laboratory Technologists",
        issueDate: new Date("2025-06-15"),
        description:
          "Comprehensive training in complete blood count, peripheral smear examination, and coagulation studies.",
        fileUrl:
          "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        filePublicId: "portfolio/certs/hematology",
        fileType: "image",
        tags: ["hematology", "CBC", "blood smear"],
        featured: true,
      },
      {
        title: "Clinical Microbiology Workshop",
        category: "Workshop",
        issuer: "National Institute of Microbiology",
        issueDate: new Date("2025-03-20"),
        description:
          "Hands-on workshop on bacterial culture techniques, gram staining, and antibiotic sensitivity testing.",
        fileUrl:
          "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        filePublicId: "portfolio/certs/microbiology",
        fileType: "image",
        tags: ["microbiology", "culture", "gram staining"],
        featured: false,
      },
      {
        title: "Laboratory Safety & Quality Control",
        category: "Certificate",
        issuer: "World Health Organization (Online)",
        issueDate: new Date("2024-11-10"),
        description:
          "Certification in laboratory biosafety, quality assurance, and standard operating procedures.",
        fileUrl:
          "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        filePublicId: "portfolio/certs/lab-safety",
        fileType: "image",
        tags: ["safety", "quality control", "biosafety"],
        featured: true,
      },
      {
        title: "Best Student Award - Clinical Pathology",
        category: "Award",
        issuer: "University Department of Pathology",
        issueDate: new Date("2025-01-20"),
        description:
          "Awarded for outstanding academic performance in Clinical Pathology during the 2nd year.",
        fileUrl:
          "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        filePublicId: "portfolio/certs/award-pathology",
        fileType: "image",
        tags: ["award", "pathology", "academic"],
        featured: false,
      },
    ]);
    console.log(`Created ${certificates.length} certificates`);

    // Create sample workshops
    const workshops = await Workshop.insertMany([
      {
        title: "Hands-on Training in Clinical Biochemistry",
        organizer: "University Hospital Laboratory",
        date: new Date("2025-08-10"),
        location: "Kolkata, West Bengal",
        description:
          "Practical training on automated biochemistry analyzers, electrolyte analysis, and liver function tests.",
        skillsGained: [
          "Biochemistry analysis",
          "Autoanalyzer operation",
          "LFT interpretation",
        ],
      },
      {
        title: "National Conference on Medical Laboratory Science",
        organizer: "Indian Medical Laboratory Association",
        date: new Date("2025-04-25"),
        location: "New Delhi",
        description:
          "Attended seminars on recent advances in laboratory diagnostics, molecular testing, and laboratory management.",
        skillsGained: [
          "Lab management",
          "Molecular diagnostics",
          "Networking",
        ],
      },
      {
        title: "Blood Bank Technology & Transfusion Medicine",
        organizer: "Regional Blood Transfusion Centre",
        date: new Date("2024-12-05"),
        location: "Kolkata, West Bengal",
        description:
          "Workshop on blood grouping, cross-matching, component preparation, and transfusion safety protocols.",
        skillsGained: [
          "Blood grouping",
          "Cross-matching",
          "Component preparation",
        ],
      },
    ]);
    console.log(`Created ${workshops.length} workshops`);

    // Create sample messages
    const messages = await Message.insertMany([
      {
        name: "Dr. Sharma",
        email: "dr.sharma@hospital.com",
        subject: "Internship Opportunity",
        message:
          "Hello Subham, I was impressed by your portfolio. We have an internship opening in our hospital laboratory. Would you be interested?",
        read: false,
      },
    ]);
    console.log(`Created ${messages.length} sample messages`);

    console.log("\n✅ Seed completed successfully!");
    console.log("\nAdmin login credentials:");
    console.log("  Email:    admin@subhamdas.com");
    console.log("  Password: admin123");
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seed();
