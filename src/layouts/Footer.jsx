import React from "react";
import { useNavigate } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
];

function Footer() {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    const linkStyle = {
        color: '#94a3b8',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        fontSize: '0.875rem',
        fontFamily: 'inherit',
        textAlign: 'left',
        transition: 'color 0.18s ease',
        lineHeight: 1.5,
    };

    return (
        <footer style={{
            background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)',
            color: '#fff',
            marginTop: '4rem',
            borderTop: '3px solid transparent',
            borderImage: 'linear-gradient(90deg, #f97316, #ef4444, #f97316) 1',
        }}>
            {/* Top gradient bar */}
            <div style={{
                height: '3px',
                background: 'linear-gradient(90deg, #f97316, #fbbf24, #ef4444, #f97316)',
                backgroundSize: '300% 100%',
                animation: 'gradientFlow 4s linear infinite',
            }} />

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem 2.5rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '3rem',
                    marginBottom: '3rem',
                }}>
                    {/* Brand */}
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ color: '#f97316' }}>GX</span>Nova
                        </h3>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem', maxWidth: '260px' }}>
                            La plataforma líder en Colombia para conectar talento experto con oportunidades reales. Seguridad, confianza y flexibilidad en cada acuerdo.
                        </p>
                        {/* Social icons */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {socialLinks.map(({ icon: Icon, label, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    style={{
                                        width: '36px', height: '36px',
                                        borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#64748b',
                                        transition: 'all 0.18s ease',
                                        textDecoration: 'none',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#ea580c'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#ea580c'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = ''; }}
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Compañía */}
                    <div>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#f97316', marginBottom: '1rem' }}>Compañía</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {[
                                { label: 'Inicio', action: () => navigate('/') },
                                { label: 'Explorar Servicios', action: () => navigate('/servicios') },
                            ].map(item => (
                                <li key={item.label}>
                                    <button
                                        onClick={item.action}
                                        style={{ ...linkStyle }}
                                        onMouseEnter={e => { e.currentTarget.style.color = '#f97316'; }}
                                        onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; }}
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Soporte */}
                    <div>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#f97316', marginBottom: '1rem' }}>Soporte</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {[
                                { label: 'Centro de Ayuda', action: null },
                                { label: 'Normas de la Comunidad', action: null },
                                { label: 'Política de Privacidad', action: () => navigate('/politica-de-privacidad') },
                                { label: 'Términos y Condiciones', action: () => navigate('/terminos-y-condiciones') },
                            ].map(item => (
                                <li key={item.label}>
                                    <button
                                        onClick={item.action || undefined}
                                        style={{ ...linkStyle, opacity: item.action ? 1 : 0.5, cursor: item.action ? 'pointer' : 'not-allowed' }}
                                        onMouseEnter={e => { if (item.action) e.currentTarget.style.color = '#f97316'; }}
                                        onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; }}
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#f97316', marginBottom: '1rem' }}>Contacto</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {[
                                { Icon: Mail, label: 'Email', value: 'soporte@gxnova.com', href: 'mailto:soporte@gxnova.com' },
                                { Icon: Phone, label: 'WhatsApp', value: '+57 300 598 1738', href: 'https://wa.me/573005981738' },
                                { Icon: MapPin, label: 'Ubicación', value: 'Popayan, Cauca, Colombia', href: null },
                            ].map(({ Icon, label, value, href }) => (
                                <li key={label} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '8px',
                                        background: 'rgba(249,115,22,0.12)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0, marginTop: '1px',
                                    }}>
                                        <Icon size={15} style={{ color: '#f97316' }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1px', fontWeight: 600 }}>{label}</p>
                                        {href
                                            ? <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#cbd5e1', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.18s' }}
                                                onMouseEnter={e => e.currentTarget.style.color = '#f97316'}
                                                onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}
                                            >{value}</a>
                                            : <p style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{value}</p>
                                        }
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.07)',
                    paddingTop: '1.75rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    textAlign: 'center',
                }}>
                    <p style={{ color: '#475569', fontSize: '0.82rem', margin: 0 }}>
                        © {currentYear} GXNova · Hecho con ❤️ en Colombia · Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
