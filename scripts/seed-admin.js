const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const email = "tino@off2zim.co.zw";
  const password = "Off2zim@2026";
  const passwordHash = hashPassword(password);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      firstName: "Tino",
      lastName: "Admin",
      name: "Tino Admin",
      role: "admin",
      passwordHash,
      verificationStatus: "basic_approved",
      hasVerifiedBadge: false,
      emailVerified: new Date(),
      explorerType: null,
      explorerScore: JSON.stringify({}),
    },
    create: {
      email,
      firstName: "Tino",
      lastName: "Admin",
      name: "Tino Admin",
      role: "admin",
      passwordHash,
      verificationStatus: "basic_approved",
      hasVerifiedBadge: false,
      emailVerified: new Date(),
      explorerScore: JSON.stringify({}),
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  console.log("Admin account ready:", admin);
}

main()
  .catch((error) => {
    console.error("Unable to seed admin account:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
