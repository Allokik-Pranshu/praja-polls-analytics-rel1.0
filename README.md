# Praja Polls Analytics Website

A responsive website for a research consultancy specializing in exit polls and election result predictions across India. Built with a modern component-based architecture for easy maintenance and scalability.

## 🏗️ Project Structure

```
praja-polls-analytics/
├── index.html                 # Main entry point (redirects to pages/home.html)
├── README.md                  # Complete project documentation
├── .vscode/                   # VS Code settings
├── components/                # Reusable HTML components
│   ├── header.html           # Navigation for pages directory
│   ├── header-states.html    # Navigation for states directory
│   ├── footer.html           # Site footer
│   └── state-sidebar.html    # State navigation sidebar
├── css/                       # Stylesheets
│   ├── styles.css            # Main styles (navigation, hero, stats, footer)
│   ├── pages.css             # Page-specific styles (states, analysis)
│   ├── about.css             # About page specific styles
│   └── contact.css           # Contact page and form styles
├── js/                        # JavaScript files
│   ├── main.js               # Core functionality (navigation, animations)
│   ├── components.js         # Component loading system
│   ├── states.js             # States page functionality
│   ├── analysis.js           # State analysis page functionality
│   └── contact.js            # Contact form and feedback functionality
├── images/                    # Logo and image assets
│   └── ppalogo.svg           # Company logo (SVG)
├── pages/                     # Main website pages (✅ All use components)
│   ├── home.html             # Homepage with hero and featured states
│   ├── states.html           # Available states listing
│   ├── about.html            # About us, team, timeline
│   └── contact.html          # Contact information and feedback form
├── states/                    # Individual state analysis pages (✅ All use components)
│   ├── uttar-pradesh.html    # UP 2017 election analysis
│   └── andhra-pradesh.html   # AP 2024 SGED survey results

```

## 🎨 Design Features

### Color Scheme
- **Primary Blue**: #1e40af (Navigation, headings, buttons)
- **Secondary Blue**: #3b82f6 (Gradients, accents)
- **Orange Accent**: #ff6b35 (CTA buttons, highlights)
- **Gray Tones**: #64748b, #f8fafc (Text, backgrounds)
- **Status Colors**: Green (active), Blue (completed), Yellow (upcoming)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive scaling** for different screen sizes

### Layout
- **Grid-based design** with CSS Grid and Flexbox
- **Clean spacing** with consistent padding/margins
- **Rounded corners** (8px, 12px) for modern look
- **Soft shadows** for depth and hierarchy

## 📱 Responsive Design

### Breakpoints
- **Desktop**: 1200px+ (Full layout)
- **Tablet**: 768px-1199px (Adjusted grids)
- **Mobile**: <768px (Stacked layout, hamburger menu)

### Mobile Features
- Hamburger navigation menu
- Stacked card layouts
- Touch-friendly button sizes
- Optimized typography scaling

## 🔧 Functionality

### Navigation
- **Sticky navbar** with scroll effects
- **Active page highlighting**
- **Mobile hamburger menu**
- **Smooth scrolling** for anchor links

### State Analysis
- **Individual pages** for each state
- **Sidebar navigation** between states
- **Interactive tables** with sorting
- **Chart placeholders** for future data visualization
- **Status indicators** (Live, Completed, Upcoming)

### Interactive Elements
- **State filtering** on states page
- **Hover animations** on cards and buttons
- **Loading animations** for chart interactions
- **Scroll-triggered animations** for content reveal

## 🧩 Component System

The website uses a modern component-based architecture for easy maintenance and consistency across all pages.

### Available Components

#### 1. **Header Components**
- `header.html` - Navigation for pages in `/pages/` directory
- `header-states.html` - Navigation for pages in `/states/` directory
- Automatically sets active navigation items based on page data attributes
- Includes logo, menu items, and mobile hamburger menu

#### 2. **Footer Component**
- `footer.html` - Site footer with contact information, quick links, and social media
- Consistent across all pages

#### 3. **State Sidebar Component**
- `state-sidebar.html` - Sidebar navigation for state analysis pages
- Shows only available states (Uttar Pradesh, Andhra Pradesh)
- Automatically sets active state based on page data attributes

### Component Usage

#### For Regular Pages (Home, About, Contact, States):
```html
<body data-page="page-name" data-page-type="default">
    <div id="header-placeholder"></div>
    <!-- Your content -->
    <div id="footer-placeholder"></div>
    <script src="../js/components.js"></script>
    <script src="../js/main.js"></script>
</body>
```

#### For State Analysis Pages:
```html
<body data-page="states" data-page-type="state" data-current-state="state-name">
    <div id="header-placeholder"></div>
    <div class="container">
        <div class="analysis-layout">
            <div id="sidebar-placeholder"></div>
            <main class="main-content">
                <!-- Your state-specific content -->
            </main>
        </div>
    </div>
    <div id="footer-placeholder"></div>
    <script src="../js/components.js"></script>
    <script src="../js/main.js"></script>
</body>
```

### Data Attributes
- `data-page`: Sets the active navigation item (home, states, about, contact)
- `data-page-type`: Determines which components to load (default, state)
- `data-current-state`: Sets the active state in the sidebar (for state pages)

### Component Benefits
1. **Easy Maintenance**: Update header/footer in one place, changes reflect everywhere
2. **Consistency**: All pages use the same navigation and footer structure
3. **Flexibility**: Easy to add new pages or modify existing ones
4. **Performance**: Components are cached by the browser after first load

## 📊 Available State Analysis

### Current States with Data
- **Uttar Pradesh** - 2017 Election Survey Data
  - 403 constituencies analyzed
  - 94% prediction accuracy achieved
  - Comprehensive poll estimates vs actual results
  
- **Andhra Pradesh** - 2024 SGED Survey Results
  - 175 constituencies covered
  - 64% overall accuracy (SGED survey)
  - Detailed constituency-wise analysis
  - Vote share and margin analysis

### Analysis Components
Each state page includes custom-built sections based on available survey data:
1. **Survey Results & Predictions**: Expected vs actual seat distribution
2. **Constituency-wise Analysis**: District-level breakdown with vote margins
3. **Comparative Analysis**: Performance vs other polling agencies (where available)
4. **Interactive Visualizations**: Charts, tables, and data representations

## 🎯 Key Pages

### Home Page (`pages/home.html`)
- Hero section with tagline "Decoding Democracy with Data"
- Statistics showcase (95% accuracy, 28 states, 50K+ surveys)
- Featured state analysis cards
- Call-to-action buttons

### States Page (`pages/states.html`)
- Complete state listing with filtering
- Status-based categorization (All, Live, Completed, Upcoming)
- Detailed state cards with metrics
- Direct links to individual state analysis

### About Page (`pages/about.html`)
- Mission statement and company values
- Leadership team profiles with credentials
- Company timeline (2009-2024)
- Achievement highlights

### Individual State Pages (`states/*.html`)
- Comprehensive analysis for each state
- Methodology breakdown
- Constituency-wise survey data
- Prediction results and insights
- State-specific political dynamics

## 🧹 Project Organization & Maintenance

### Component System Migration
All pages have been converted to use the component system:
- ✅ **Pages converted**: home.html, about.html, contact.html, states.html
- ✅ **State pages converted**: uttar-pradesh.html, andhra-pradesh.html
- ✅ **Removed unused states**: Only showing states with actual survey data
- ✅ **Clean structure**: No duplicate headers/footers across files

### Adding New Content

#### Adding New Regular Pages:
1. Create HTML file in `/pages/` directory
2. Use component system structure (see examples above)
3. Set appropriate `data-page` attribute
4. Components will load automatically

#### Adding New State Analysis:
1. Create HTML file in `/states/` directory
2. Use state page component structure
3. Build custom analysis sections based on survey data
4. Add state to `components/state-sidebar.html`
5. Update `pages/states.html` with new state card

#### Updating Components:
- **Navigation changes**: Edit `components/header.html` or `components/header-states.html`
- **Footer updates**: Edit `components/footer.html`
- **Sidebar updates**: Edit `components/state-sidebar.html`

### File Organization
- **No duplicate code**: Header/footer defined once in components
- **Modular structure**: CSS, JS, pages, and states in separate directories
- **Clean file structure**: No redundant or unused files
- **Consistent naming**: All files follow clear naming conventions
- **Removed empty directories**: Cleaned up `admin/` and `templates/` folders
- **Single documentation**: All project info consolidated in main README.md

## 🚀 Getting Started

1. **Clone or download** the project files
2. **Open `index.html`** in a web browser (will redirect to `pages/home.html`)
3. **Navigate** through the site using the main navigation
4. **Explore** individual state analyses from the states page

## 🔮 Future Enhancements

### Data Visualization
- Integration with Chart.js or D3.js for interactive charts
- Real-time data updates via API
- Interactive constituency maps

### Advanced Features
- User authentication for premium content
- Email notifications for analysis updates
- Social media integration
- Multi-language support (Hindi, regional languages)

### Performance
- Image optimization and lazy loading
- Progressive Web App (PWA) features
- Content Delivery Network (CDN) integration

## 📝 Content Management

### Adding New States
Since each election survey has unique data structures and requirements, new state pages should be built individually:

1. **Analyze Survey Data**: Review data format, parameters, and visualization needs
2. **Create State Page**: Build custom HTML file in `/states/` directory using component system
3. **Update Sidebar**: Add new state to `components/state-sidebar.html`
4. **Update States Page**: Add state card to `pages/states.html`
5. **Custom Design**: Create unique sections based on specific survey data requirements

### Updating Analysis Data
- Modify constituency tables in respective state files
- Update confidence scores and metrics
- Refresh "last updated" timestamps

## 🎨 Customization

### Colors
- Modify CSS custom properties in `css/styles.css`
- Update status colors in `css/pages.css`

### Layout
- Adjust grid templates in respective CSS files
- Modify breakpoints for different responsive behavior

### Content
- Update placeholder text with actual data
- Replace [name], [phone_number], [address] with real information
- Add actual director information and credentials

## 📄 License

This project is created for Praja Polls Analytics. All rights reserved.

---

**Praja Polls Analytics** - Decoding Democracy with Data