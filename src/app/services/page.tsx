import React from 'react'
import Link from 'next/link'
import {
    Cpu,
    Brain,
    Zap,
    Shield,
    BarChart3,
    Smartphone,
    Cloud,
    Settings,
    ArrowRight,
    CheckCircle,
    Users,
    TrendingUp,
    Target,
    Code
} from 'lucide-react'

const Services = () => {
    const services = [
        {
            icon: <Brain className="w-8 h-8" />,
            title: "R&D Innovation",
            description: "Cutting-edge research and development to create innovative technology solutions that solve complex problems.",
            features: [
                "Technology Research",
                "Prototype Development",
                "Feasibility Studies",
                "Innovation Consulting"
            ],
            color: "bg-gray-900",
            iconColor: "text-gray-900"
        },
        {
            icon: <Cpu className="w-8 h-8" />,
            title: "IoT Development",
            description: "End-to-end IoT solutions including hardware design, firmware development, and cloud integration.",
            features: [
                "Sensor Integration",
                "Edge Computing",
                "Wireless Connectivity",
                "IoT Platform Development"
            ],
            color: "bg-black",
            iconColor: "text-black"
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Smart Solutions",
            description: "Intelligent automation and smart technology implementations for homes, offices, and industries.",
            features: [
                "Home Automation",
                "Energy Management",
                "Smart Security",
                "Predictive Maintenance"
            ],
            color: "bg-gray-800",
            iconColor: "text-gray-800"
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            title: "Data Analytics",
            description: "Transform raw data into actionable insights with advanced analytics and visualization tools.",
            features: [
                "Real-time Analytics",
                "Predictive Modeling",
                "Data Visualization",
                "Business Intelligence"
            ],
            color: "bg-gray-900",
            iconColor: "text-gray-900"
        },
        {
            icon: <Cloud className="w-8 h-8" />,
            title: "Cloud Solutions",
            description: "Scalable cloud infrastructure and services for seamless digital transformation.",
            features: [
                "Cloud Migration",
                "Serverless Architecture",
                "Cloud Security",
                "DevOps Services"
            ],
            color: "bg-black",
            iconColor: "text-black"
        },
        {
            icon: <Smartphone className="w-8 h-8" />,
            title: "Mobile Applications",
            description: "Native and cross-platform mobile apps with focus on performance and user experience.",
            features: [
                "iOS & Android Development",
                "React Native Apps",
                "Mobile UI/UX Design",
                "App Maintenance"
            ],
            color: "bg-gray-800",
            iconColor: "text-gray-800"
        }
    ]

    const process = [
        {
            step: "01",
            title: "Discovery",
            description: "Understand your requirements and business objectives",
            icon: <Target className="w-6 h-6" />
        },
        {
            step: "02",
            title: "Strategy",
            description: "Develop a comprehensive technology strategy",
            icon: <Brain className="w-6 h-6" />
        },
        {
            step: "03",
            title: "Development",
            description: "Agile development with continuous iterations",
            icon: <Code className="w-6 h-6" />
        },
        {
            step: "04",
            title: "Deployment",
            description: "Seamless deployment and integration",
            icon: <Settings className="w-6 h-6" />
        }
    ]

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-24 md:py-32">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000002_1px,transparent_1px),linear-gradient(to_bottom,#00000002_1px,transparent_1px)] bg-[size:40px_40px]" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full mb-8">
                            <div className="w-2 h-2 bg-black rounded-full" />
                            <span className="text-sm font-medium">Technology Services</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Expert
                            <span className="block bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
                                Technology Services
                            </span>
                        </h1>

                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            We provide comprehensive technology solutions from research and development
                            to full-scale implementation. Our expertise spans IoT, smart solutions,
                            and cutting-edge innovation.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/contact"
                                className="group px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                            >
                                Start Your Project
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/portfolio"
                                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
                            >
                                View Our Work
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Services</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Comprehensive technology solutions designed to transform your business operations
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl"
                            >
                                <div className="p-8">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`p-3 rounded-lg ${service.color} bg-opacity-10`}>
                                            <div className={service.iconColor}>
                                                {service.icon}
                                            </div>
                                        </div>
                                        <div className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                                            Service {index + 1}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold mb-4 text-gray-900">{service.title}</h3>
                                    <p className="text-gray-600 mb-6">{service.description}</p>

                                    <ul className="space-y-3 mb-8">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-3">
                                                <CheckCircle className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        href={`/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-black transition-colors"
                                    >
                                        Learn More
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Process */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Process</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            A structured approach to delivering exceptional technology solutions
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {process.map((item, index) => (
                            <div key={index} className="relative">
                                <div className="bg-white p-8 rounded-xl border border-gray-200 h-full">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-lg font-bold">
                                            {item.step}
                                        </div>
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            {item.icon}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                                    <p className="text-gray-600">{item.description}</p>
                                </div>

                                {index < process.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 right-0 w-8 h-0.5 bg-gray-300 transform translate-x-4" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Why Partner With TechInfoSync
                            </h2>
                            <p className="text-gray-600 mb-8">
                                We combine technical expertise with business understanding to deliver
                                solutions that drive real value for your organization.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-black rounded-lg">
                                        <Users className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-2">Expert Team</h3>
                                        <p className="text-gray-600">
                                            Skilled professionals with extensive experience in technology development
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-black rounded-lg">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-2">Quality Focus</h3>
                                        <p className="text-gray-600">
                                            Rigorous testing and quality assurance at every stage of development
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-black rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-2">Scalable Solutions</h3>
                                        <p className="text-gray-600">
                                            Future-proof technology that grows with your business needs
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-xl border border-gray-200">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold mb-6">Start Your Project</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-black rounded-full" />
                                        <span className="font-medium">Free consultation</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-black rounded-full" />
                                        <span className="font-medium">Customized solutions</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-black rounded-full" />
                                        <span className="font-medium">Transparent pricing</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-black rounded-full" />
                                        <span className="font-medium">Ongoing support</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-200">
                                    <Link
                                        href="/contact"
                                        className="w-full block text-center px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        Get in Touch
                                    </Link>
                                    <p className="text-center text-sm text-gray-500 mt-3">
                                        Response within 24 hours
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-black text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Transform Your Business?
                    </h2>
                    <p className="text-gray-300 mb-8 text-lg">
                        Let's discuss how our technology services can help you achieve your goals
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/contact"
                            className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Schedule a Call
                        </Link>
                        <a
                            href="mailto:voskiveriga@gmail.com"
                            className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                        >
                            Email Us
                        </a>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-800">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <div className="text-2xl font-bold">50+</div>
                                <div className="text-sm text-gray-400">Projects Completed</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">15+</div>
                                <div className="text-sm text-gray-400">Industry Verticals</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">98%</div>
                                <div className="text-sm text-gray-400">Client Satisfaction</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">24/7</div>
                                <div className="text-sm text-gray-400">Technical Support</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Services
