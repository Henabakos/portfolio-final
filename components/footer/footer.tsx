export function Footer() {
  return (
    <footer className="bg-[#F5F7F9] dark:bg-[#1A1A1A] py-16">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-6">
          <h2 className="text-5xl md:text-6xl font-bold text-[#1a1a1a] dark:text-[#CDD0DA]">
            Let's Talk
          </h2>

          <a
            href="mailto:youremail@domain.com"
            className="text-lg text-foreground hover:text-muted-foreground transition-colors block"
          >
            henogato9876@gmail.com
          </a>

          <div className="pt-8">
            <p className="text-sm text-muted-foreground">
              {new Date().getFullYear()}
              <span className="font-semibold text-foreground">
                Henok Assefa
              </span>
              . All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
