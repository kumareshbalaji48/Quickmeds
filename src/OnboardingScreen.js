import React from 'react';
import {
  SafeAreaView,
  Image,
  StyleSheet,
  FlatList,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const COLORS = { primary: '#020E22', white: '#fff' };

const slides = [
  {
    id: '1',
    image: require('../assets/images/onboarding/Illustration1.png'),
    title: 'Welcome!',
    subtitle:
      'We will assist you in efficiently and easily scheduling appointments with doctors so Let\'s get started.',
  },
  {
    id: '2',
    image: require('../assets/images/onboarding/Illustration2.png'),
    title: 'Choose Specialization',
    subtitle:
      'Select the medical specialization you need so we can tailor your experience.',
  },
  {
    id: '3',
    image: require('../assets/images/onboarding/Illustration3.png'),
    title: 'Schedule Your Appointment Hassle-Free',
    subtitle:
      'Monitor your appointment and keep track of your records. Begin your journey to better health!',
  },
];

const Slide = ({ item }) => {
  return (
    <View style={{ width, alignItems: 'flex-start', paddingHorizontal: 10 }}>
      <Image
        source={item?.image}
        style={styles.image}
      />
      <Text style={styles.title}>{item?.title}</Text>
      <Text style={styles.subtitle}>{item?.subtitle}</Text>
    </View>
  );
};

const OnboardingScreen = ({ navigation }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const ref = React.useRef();

  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex != slides.length) {
      const offset = nextSlideIndex * width;
      ref?.current.scrollToOffset({ offset });
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const skip = () => {
    const lastSlideIndex = slides.length - 1;
    const offset = lastSlideIndex * width;
    ref?.current.scrollToOffset({ offset });
    setCurrentSlideIndex(lastSlideIndex);
  };

  const Footer = () => {
    return (
      <View style={styles.footerContainer}>
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex === index && {
                  backgroundColor: COLORS.white,
                  width: 60,
                },
              ]}
            />
          ))}
        </View>
        <View style={{ marginBottom: 20 }}>
          {currentSlideIndex === slides.length - 1 ? (
            <View style={{ height: 50 }}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => navigation.navigate('FirstPage')}
              >
                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                  GET STARTED
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.btn, styles.skipBtn]}
                onPress={skip}
              >
                <Text style={styles.skipText}>SKIP</Text>
              </TouchableOpacity>
              <View style={{ width: 15 }} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={goToNextSlide}
                style={styles.btn}
              >
                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>NEXT</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <StatusBar backgroundColor={COLORS.primary} />
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        contentContainerStyle={{ height: height * 0.75 }}
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
        data={slides}
        renderItem={({ item }) => <Slide item={item} />}
      />
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    height: height * 0.55,
    width: '100%',
    resizeMode: 'cover',
    marginBottom: 20,
  },
  subtitle: {
    color: COLORS.white,
    fontSize: 17,
    marginTop: 10,
    maxWidth: '95%',
    textAlign: 'left',
    lineHeight: 26,
  },
  title: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginTop: 20,
    textAlign: 'left',
  },
  footerContainer: {
    height: height * 0.20,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  indicatorContainer: {
    flexDirection:'row',
    justifyContent: 'center',
    marginBottom: 0,
    paddingVertical: 55,
    paddingBottom: 0,
  },
  indicator: {
    height: 10,
    width: 10,
    backgroundColor: '#4F73DF',
    marginHorizontal: 5,
    borderRadius: 6,
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    backgroundColor: '#4F73DF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipBtn: {
    borderColor: COLORS.white,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  skipText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: COLORS.white,
  },
});

export default OnboardingScreen;
