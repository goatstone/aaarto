import AaartoButton from "./components/AaartoButton";

export default function Page() {
  return (
    <>
      <h1>Aaarto</h1>
      <h3>Create and Mint Art</h3>
      <svg
        version="1.1"
        width="300"
        height="300"
        xmlns="http://www.w3.org/2000/svg"
        id="art"
      >
        <rect width="100%" height="100%" fill="gray" />
        <circle cx="150" cy="100" r="80" fill="green" />
        <text x="150" y="125" font-size="50" text-anchor="middle" fill="white">
          Aaarto
        </text>
      </svg>
      <AaartoButton />
    </>
  );
}
