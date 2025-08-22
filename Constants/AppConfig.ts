// Simple React Native specific changes

 
export default {
  // font scaling override - RN default is on
  allowTextFontScaling: true,
  maxFontScale: 1.0,
  apiUrl: 'http://app.eoehelps.com/',
  token: '81e5881511f2ad3e79764110ce96fe57',
  shareSubscriptionId: "com.eoebooks.eoe.sharingsubscription",
  // apiUrl: 'http://localhost:3000/',
  // token: 'a91bd3e3034a5d2da943d3ef655e2b6c',
  images: {
    backgroundImage: require('../assets/Images/lavender-background.png'),
    logo: require('../assets/Images/logo.png'),
    icons: {
      overview: require('../assets/Images/Icons/overview.png'),
      glossary: require('../assets/Images/Icons/glossary.png'),
      apply: require('../assets/Images/Icons/apply.png'),
      health: require('../assets/Images/Icons/health.png'),
      safety: require('../assets/Images/Icons/safety.png'),
      about: require('../assets/Images/Icons/about.png'),
      oils: require('../assets/Images/Icons/oils.png'),
      blends: require('../assets/Images/Icons/blends.png'),
      close: require('../assets/Images/Icons/close-button.png'),
      share: require('../assets/Images/Icons/share.png'),
      products: require('../assets/Images/Icons/products.png')
    }
  }
}
