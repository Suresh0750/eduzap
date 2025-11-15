

const Header = ()=>{
    return(
        <header className="sticky top-0 z-40 border-b border-primary/20 bg-card/95 backdrop-blur-sm bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                Eduzap Requests
              </h1>
              <p className="text-muted-foreground mt-1">
                Real-time request management with intelligent caching
              </p>
            </div>
          </div>
        </div>
      </header>
    )
}



export default Header;