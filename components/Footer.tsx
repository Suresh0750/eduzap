
const Footer = ()=>(
    <footer className="border-t border-primary/20 bg-card/50 mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <p className="font-semibold text-foreground">Eduzap</p>
          <p className="text-sm text-muted-foreground mt-1">
            Request Anything, We Deliver in 2 Hours
          </p>
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">Technology</p>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li>Next.js 16 + TypeScript</li>
            <li>MongoDB + LRU Cache</li>
            <li>Real-time Updates</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">Features</p>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li>Form Validation</li>
            <li>Search & Sort</li>
            <li>Pagination</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary/10 pt-6 text-center text-xs text-muted-foreground">
        <p>Built with Next.js, MongoDB, and TypeScript. Demonstrates full-stack best practices.</p>
        <p className="mt-2">Eduzap Interview Assignment - 2025</p>
      </div>
    </div>
  </footer>
)

export default Footer;