import { Card } from '@/components';
import { Heart, Users, Globe, Target } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Love',
      description: 'We love God and love people with all our hearts',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We believe in the power of community and fellowship',
    },
    {
      icon: Globe,
      title: 'Impact',
      description: 'We strive to make a positive impact in our community',
    },
    {
      icon: Target,
      title: 'Growth',
      description: 'We are committed to continuous spiritual growth',
    },
  ];

  const team = [
    {
      name: 'Pastor John Doe',
      role: 'Senior Pastor',
      bio: 'With over 20 years of ministry experience...',
    },
    {
      name: 'Pastor Jane Smith',
      role: 'Associate Pastor',
      bio: 'Passionate about youth ministry and outreach...',
    },
    {
      name: 'David Johnson',
      role: 'Worship Leader',
      bio: 'Leading worship and singing praises since 2010...',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">About ElimThrone Church</h1>
          <p className="text-xl text-purple-100">
            Our story, vision, and commitment to serving our community
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Our Story */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                ElimThrone Church was founded in 2005 with a vision to create a place where people
                could encounter God's love and grow in their faith. What started with a small group
                of believers has grown into a thriving community of thousands.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Our mission is to help people experience the transformational power of Jesus Christ
                and to use our gifts to serve our community with compassion and integrity.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Today, we continue to fulfill this mission through our worship services, small groups,
                community outreach programs, and various ministries designed to impact lives.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg h-96"></div>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <Card key={idx} className="text-center hover:shadow-lg transition">
                  <Icon size={48} className="text-purple-600 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-700 text-sm">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Leadership Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Leadership</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, idx) => (
              <Card key={idx} className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4"></div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-700 text-sm">{member.bio}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Ministries Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Ministries</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Children & Youth Ministry',
                description: 'Nurturing young minds in faith and building strong foundations',
              },
              {
                title: 'Worship & Music',
                description: 'Creating space for authentic worship and musical expression',
              },
              {
                title: 'Community Outreach',
                description: 'Serving the poor, homeless, and marginalized in our community',
              },
              {
                title: 'Small Groups',
                description: 'Building deep connections and discipleship in smaller communities',
              },
            ].map((ministry, idx) => (
              <Card key={idx} className="border-l-4 border-purple-600">
                <h3 className="font-bold text-lg mb-2">{ministry.title}</h3>
                <p className="text-gray-700">{ministry.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-purple-600">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To be a beacon of hope and a place of transformation where every person encounters
                God's unconditional love, discovers their purpose, and becomes equipped to impact
                their world for Christ.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 text-purple-600">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To reach people with the Gospel, teach them God's Word, help them grow spiritually,
                and send them out to serve and make disciples who will transform our community and
                the world.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
