import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'; 
import { ArrowRight, Users, MessageSquare, BookOpen, UserCheck, DollarSign } from 'lucide-react';

export default function HowItWorks() {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef(null);
  
  // References for parallax sections
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const section4Ref = useRef(null);
  const section5Ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  });

  // Parallax effects for background elements
  const bgParallax1 = useTransform(smoothProgress, [0, 1], [0, -100]);
  const bgParallax2 = useTransform(smoothProgress, [0, 1], [0, -150]);
  const bgParallax3 = useTransform(smoothProgress, [0, 1], [0, -200]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      const sections = [
        section1Ref.current,
        section2Ref.current,
        section3Ref.current,
        section4Ref.current,
        section5Ref.current
      ];
      
      sections.forEach((section, index) => {
        if (!section) return;
        
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
          setActiveSection(index);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const steps = [
    {
      title: "Sign Up & Profile Creation",
      description: "Create your account and tell us what skills you want to learn and which ones you can teach to others.",
      icon: <UserCheck size={36} />,
      image : "/images/1.png",
      ref: section1Ref,
      color: "bg-indigo-500"
    },
    {
      title: "Explore How It Works",
      description: "Understand our platform's functionality through this interactive guide to make the most of your experience.",
      icon: <BookOpen size={36} />,
      ref: section2Ref,
      image : "/images/2.png",
      color: "bg-blue-500"
    },
    {
      title: "Find Your Skills Match",
      description: "Our algorithm connects you with users who want to learn what you teach and can teach what you want to learn.",
      icon: <Users size={36} />,
      ref: section3Ref,
      image : "/images/3.png",
      color: "bg-teal-500"
    },
    {
      title: "Connect & Communicate",
      description: "Send connection requests to potential skill exchange partners and start chatting to arrange your lessons.",
      icon: <MessageSquare size={36} />,
      ref: section4Ref,
      image : "/images/4.png",
      color: "bg-emerald-500"
    },
    {
      title: "Exchange Skills For Free",
      description: "Our platform charges no fees. Arrange lessons and decide between yourselves if any compensation is desired.",
      icon: <DollarSign size={36} />,
      ref: section5Ref,
      image : "/images/5.png",
      color: "bg-amber-500"
    }
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gray-50">
      {/* Parallax background elements */}
      <motion.div 
        className="fixed top-20 right-20 w-64 h-64 rounded-full bg-indigo-100 opacity-40 -z-10"
        style={{ y: bgParallax1, x: useTransform(smoothProgress, [0, 1], [0, 100]) }}
      />
      <motion.div 
        className="fixed top-1/4 left-20 w-96 h-96 rounded-full bg-teal-100 opacity-40 -z-10"
        style={{ y: bgParallax2, x: useTransform(smoothProgress, [0, 1], [0, -100]) }}
      />
      <motion.div 
        className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-100 opacity-30 -z-10"
        style={{ y: bgParallax3, scale: useTransform(smoothProgress, [0, 0.5, 1], [1, 1.2, 1]) }}
      />
      <motion.div 
        className="fixed bottom-20 left-1/3 w-48 h-48 rounded-full bg-emerald-100 opacity-30 -z-10"
        style={{ 
          y: useTransform(smoothProgress, [0, 1], [0, -150]),
          x: useTransform(smoothProgress, [0, 1], [0, 100])
        }}
      />
      
      {/* Header with parallax */}
      <motion.div 
        className="relative py-24 px-4 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white overflow-hidden"
        style={{
          backgroundPosition: useTransform(smoothProgress, [0, 0.5], ['center 0%', 'center 50%'])
        }}
      >
        <motion.div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0) 70%), radial-gradient(circle at 70% 20%, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0) 70%)',
            y: useTransform(scrollYProgress, [0, 1], [0, -50])
          }}
        />
        
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            How Our Platform Works
          </motion.h1>
          <motion.p 
            className="text-xl opacity-90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Exchange skills, grow together, without any fees or hidden costs
          </motion.p>
        </div>
      </motion.div>
      
      {/* Steps navigator */}
      <div className="sticky top-0 z-10 bg-white shadow">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto py-4 gap-2 md:gap-0 md:justify-between">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => {
                  step.ref.current.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`flex-shrink-0 flex flex-col items-center px-2 md:px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeSection === index ? 'text-indigo-600' : 'text-gray-500'
                }`}
              >
                <div className={`w-10 h-10 flex items-center justify-center rounded-full mb-2 transition-all duration-300 ${
                  activeSection === index ? step.color + ' text-white' : 'bg-gray-100'
                }`}>
                  {index + 1}
                </div>
                <span className="text-xs md:text-sm font-medium whitespace-nowrap">{step.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Steps content with parallax effects */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {steps.map((step, index) => {
          // Create custom parallax values for each section
          const yOffset = index * 100;
          return (
            <div 
              key={index}
              ref={step.ref}
              className="min-h-screen flex flex-col justify-center py-24"
            >
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`order-2 md:order-${index % 2 === 0 ? 1 : 2}`}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${step.color} text-white mb-6`}>
                    {step.icon}
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{step.title}</h2>
                  <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                  
                  <motion.div 
                    className={`p-6 rounded-xl bg-white shadow-lg border-l-4 ${step.color}`}
                    whileInView={{ 
                      boxShadow: ["0px 4px 10px rgba(0,0,0,0.1)", "0px 10px 25px rgba(0,0,0,0.2)", "0px 4px 10px rgba(0,0,0,0.1)"] 
                    }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  >
                    {index === 0 && (
                      <div className="space-y-4">
                        <p className="font-medium">In your profile, you'll specify:</p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Skills you want to learn</li>
                          <li>Skills you can teach others</li>
                          <li>Your experience level</li>
                          <li>Preferred learning/teaching schedule</li>
                        </ul>
                      </div>
                    )}
                    
                    {index === 1 && (
                      <div className="space-y-4">
                        <p className="font-medium">Benefits of understanding our platform:</p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>More successful skill matches</li>
                          <li>Better communication with potential partners</li>
                          <li>Higher quality learning experiences</li>
                          <li>Maximum value from the platform</li>
                        </ul>
                      </div>
                    )}
                    
                    {index === 2 && (
                      <div className="space-y-4">
                        <p className="font-medium">Our matching algorithm considers:</p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Compatible skill exchange opportunities</li>
                          <li>Experience levels</li>
                          <li>Schedule compatibility</li>
                          <li>Learning preferences</li>
                        </ul>
                      </div>
                    )}
                    
                    {index === 3 && (
                      <div className="space-y-4">
                        <p className="font-medium">Communication features include:</p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Direct messaging</li>
                          <li>Connection requests</li>
                          <li>Schedule coordination</li>
                          <li>File and resource sharing</li>
                        </ul>
                      </div>
                    )}
                    
                    {index === 4 && (
                      <div className="space-y-4">
                        <p className="font-medium">Our zero-fee policy means:</p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>No platform charges ever</li>
                          <li>You decide if lessons are free or paid</li>
                          <li>Direct arrangements between users</li>
                          <li>Focus on skill exchange over monetary gain</li>
                        </ul>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`order-1 md:order-${index % 2 === 0 ? 2 : 1}`}
                >
                  <motion.div 
                    className="relative"
                    whileInView={{ 
                      rotateY: [0, 5, 0, -5, 0],
                      rotateX: [0, -5, 0, 5, 0]
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity,
                      repeatType: "loop" 
                    }}
                  >
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br from-${step.color.split('-')[1]}-100 to-${step.color.split('-')[1]}-50 rounded-xl transform rotate-3 scale-95 opacity-50`}
                      whileInView={{ 
                        rotate: [3, 5, 2, 4, 3],
                        scale: [0.95, 0.97, 0.96, 0.98, 0.95]
                      }}
                      transition={{ 
                        duration: 8, 
                        repeat: Infinity,
                        repeatType: "reverse" 
                      }}
                    ></motion.div>
                    <div className="relative bg-white p-4 rounded-xl shadow-lg">
                      {/* Placeholder for an illustration - would be replaced with actual image/SVG */}
                      <div className={`aspect-video rounded-lg bg-${step.color.split('-')[1]}-50 flex items-center justify-center overflow-hidden`}>
                        <motion.img 
                          src={`${step.image}`} // Placeholder image path
                          alt={`Illustration for ${step.title}`}
                          className="rounded-lg w-full h-full object-cover"
                          whileInView={{ 
                            scale: [1, 1.05, 1],
                          }}
                          transition={{ 
                            duration: 5, 
                            repeat: Infinity,
                            repeatType: "reverse" 
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex justify-center my-24">
                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-indigo-500"
                  >
                    <ArrowRight size={24} className="transform rotate-90" />
                  </motion.div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* CTA Section with parallax effects */}
      <motion.div 
        className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-20 relative overflow-hidden"
        style={{
          backgroundPosition: useTransform(smoothProgress, [0, 1], ['center 0%', 'center 30%'])
        }}
      >
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-0 right-0 w-full h-full opacity-10"
          style={{
            background: "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0) 70%)",
            y: useTransform(smoothProgress, [0, 1], [0, -50])
          }}
        />
        
        <motion.div 
          className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white opacity-10"
          style={{
            scale: useTransform(smoothProgress, [0, 1], [1, 1.5]),
            x: useTransform(smoothProgress, [0, 1], [0, 30]),
            y: useTransform(smoothProgress, [0, 1], [0, -20])
          }}
        />
        
        <motion.div 
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white opacity-10"
          style={{
            scale: useTransform(smoothProgress, [0, 1], [1, 1.2]),
            x: useTransform(smoothProgress, [0, 1], [0, -30]),
            y: useTransform(smoothProgress, [0, 1], [0, 20])
          }}
        />
        
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Ready to Start Your Skill Exchange Journey?
          </motion.h2>
          
          <motion.p 
            className="text-xl opacity-90 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join our community and start learning and teaching today!
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.button 
              className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-medium text-lg shadow-lg"
              whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Sign Up Now
            </motion.button>
            
            <motion.button 
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-medium text-lg"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p>© 2025 Skill Exchange Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}