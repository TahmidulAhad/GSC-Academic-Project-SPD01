import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

// Base64 encoded images for the team members
const logoImage = "/logo.png";
const tahmidulImage = "/ahad.png";
const abdurImage = "/abdur.jpg";
const tawsifImage = "/tawsif.jpg";
const saifulImage = "/fahim.jpg";
const mehrubImage = "/mehrub.jpg";

const TeamMemberCard: React.FC<{ name: string, role: string, avatar: string }> = ({ name, role, avatar }) => (
    <div className="text-center p-4">
        <img src={avatar} alt={name} className="w-24 h-24 rounded-full mx-auto mb-3 shadow-md object-cover" />
        <h3 className="font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500">{role}</p>
    </div>
);

const AboutPage: React.FC = () => {
    const { t } = useTranslation();

    const leaders = [
        { nameKey: 'about.leader1.name', roleKey: 'about.leader1.role', avatar: tahmidulImage },
        { nameKey: 'about.leader2.name', roleKey: 'about.leader2.role', avatar: abdurImage },
    ];
    
    const devTeam = [
        { id: 1, nameKey: 'about.dev1.name', roleKey: 'about.dev1.role', avatar: tawsifImage },
        { id: 2, nameKey: 'about.dev2.name', roleKey: 'about.dev2.role', avatar: saifulImage },
        { id: 3, nameKey: 'about.dev3.name', roleKey: 'about.dev3.role', avatar: mehrubImage },
    ];


    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                <div className="text-center mb-12">
                    <img src={logoImage} alt="Logo" className="mx-auto mb-4 w-40 h-30 object-contain" />
                    <h1 className="text-4xl font-bold text-teal-600">{t('about.title')}</h1>
                </div>

                <div className="bg-gray-50 p-8 rounded-lg mb-12 text-center shadow-sm">
                    <p className="text-lg text-gray-700 leading-relaxed">{t('about.description')}</p>
                    <p className="mt-4 text-lg text-gray-700 leading-relaxed">{t('about.subDescription')}</p>
                </div>

                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-center mb-8">{t('about.keyPurpose')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-teal-50 p-6 rounded-lg flex items-center"><span className="text-teal-500 mr-4">&#10003;</span><span>{t('about.purpose1')}</span></div>
                        <div className="bg-teal-50 p-6 rounded-lg flex items-center"><span className="text-teal-500 mr-4">&#10003;</span><span>{t('about.purpose2')}</span></div>
                        <div className="bg-teal-50 p-6 rounded-lg flex items-center"><span className="text-teal-500 mr-4">&#10003;</span><span>{t('about.purpose3')}</span></div>
                        <div className="bg-teal-50 p-6 rounded-lg flex items-center"><span className="text-teal-500 mr-4">&#10003;</span><span>{t('about.purpose4')}</span></div>
                    </div>
                </div>

                <div className="bg-gray-50 p-8 rounded-lg mb-12 shadow-sm">
                    <h2 className="text-3xl font-bold text-center mb-2">{t('about.leadership')}</h2>
                    <p className="text-center text-gray-600 mb-8">{t('about.leadership.description')}</p>
                    <div className="flex flex-col md:flex-row justify-center gap-8">
                        {leaders.map((leader, index) => <TeamMemberCard key={index} name={t(leader.nameKey as any)} role={t(leader.roleKey as any)} avatar={leader.avatar} />)}
                    </div>
                    <p className="text-center italic text-gray-700 mt-8 max-w-3xl mx-auto">{t('about.leadership.together')}</p>
                </div>

                <div className="mb-12">
                     <h2 className="text-3xl font-bold text-center mb-2">{t('about.devTeam')}</h2>
                     <p className="text-center text-gray-600 mb-8">{t('about.devTeam.description')}</p>
                     <div className="flex flex-wrap justify-center gap-8">
                        {devTeam.map((member) => <TeamMemberCard key={member.id} name={t(member.nameKey as any)} role={t(member.roleKey as any)} avatar={member.avatar} />)}
                     </div>
                </div>

                <div className="bg-teal-600 text-white p-10 rounded-lg text-center shadow-lg">
                    <h2 className="text-3xl font-bold mb-4">{t('about.joinMission')}</h2>
                    <p className="mb-6">{t('about.joinMission.description')}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/submit-request" className="px-6 py-3 font-semibold bg-white text-teal-600 rounded-md hover:bg-gray-100 transition-all">{t('home.requestHelp')}</Link>
                        <Link to="/register" className="px-6 py-3 font-semibold bg-teal-700 text-white rounded-md hover:bg-teal-800 transition-all">{t('home.joinVolunteer')}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;