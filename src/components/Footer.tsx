export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t bg-white dark:bg-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-sm text-gray-600 dark:text-gray-300">
        <p>© {new Date().getFullYear()} Osmrtnice. Sva prava pridržana.</p>
        <div className="flex items-center gap-4">
          <a href="/" className="hover:underline">
            Početna
          </a>
          <a href="/admin/osmrtnice/new" className="hover:underline">
            Nova osmrtnica
          </a>
        </div>
      </div>
    </footer>
  );
}
