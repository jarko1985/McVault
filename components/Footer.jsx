export default function Footer() {
    return (
      <footer className="w-full text-center py-8 border-t bg-gray-100 mt-auto relative overflow-hidden">
        {/* Moving text effect */}
        <div className="absolute top-0 left-0 w-full overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-red-600 font-semibold text-sm">
            Important note: This website is for internal use only...
          </div>
        </div>
  
        {/* Copyright */}
        <p className="text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} McVault. All rights reserved.
        </p>
      </footer>
    );
  }