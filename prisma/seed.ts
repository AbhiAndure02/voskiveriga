async function main() {
  console.log("No demo products seeded. Add real products from the admin panel.");
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
