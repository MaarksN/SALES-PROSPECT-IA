<<<<<<< HEAD
export const setup = () => {
  // Global setup logic (e.g., seeding DB, starting mock server)
  process.env.TZ = 'UTC';
};
=======
export async function setup() {
  // Implement cleanup logic here
  // console.log('Global setup: Cleaning test database...');
}

export async function teardown() {
  // Teardown logic
}
>>>>>>> main
