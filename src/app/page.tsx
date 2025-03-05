import AddressForm from "../components/AddressForm";

export default function Home() {
  return (
    <main className="min-h-screen p-6 md:p-24 flex flex-col items-center">
      <div className="w-full max-w-3xl mb-12 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center mb-2">
          Address Validator
        </h1>
        <p className="text-lg text-center text-gray-600 dark:text-gray-400">
          Enter your address details to validate with Australia Post
        </p>
      </div>

      <AddressForm />
    </main>
  );
}
