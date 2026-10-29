import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaFacebookF, FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import AssistantPreview from "../Components/AssistantPreview";
import logo from '../assets/logo1.jpeg'

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://www.facebook.com/share/1Hgv8i6B7H/', Icon: FaFacebookF },
  { label: 'Instagram', href: 'https://www.instagram.com/alok_prajapati_07?igsh=MTFwMDQ5OGtvdnhjMg==', Icon: FaInstagram },
  { label: 'GitHub', href: 'https://github.com/alokprajapati30', Icon: FaGithub },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alok-prajapati-21404a2a7?utm_source=share_via&utm_content=profile&utm_medium=member_android', Icon: FaLinkedinIn },
  { label: 'X', href: 'https://x.com/AlokPrajapati03', Icon: FaXTwitter },
]

const STEPS = [
  {
    step: '01',
    title: 'sign up free',
    desc: "Continue with google and create your assistant instantly.",
  },


  {
    step: "02",
    title: "Customize assistant ",
    desc: "Set your business name tone voice and theme ",
  },

  {
    step: "03",
    title: "Train your assistant ",
    desc: " Add busuness details and personalize responses. ",
  },

  {
    step: "04",
    title: "Embed anywhere ",
    desc: "Copy one Scripttag and add it to your website. ",
  },


];

const Home = ({ user }) => {
  const navigate = useNavigate()

  return (
    <div id='top' className='min-h-screen bg-[#f8fafc] overflow-hidden'>

      <section className=' relative overflow-hidden px-4 sm:px-6 lg:px-8
      pt-16 sm:pt-20 lg:pt-8 pb-20'>

        <div className='absolute inset-0 bg-gradient-to-r from-purple-100
        via-white to-emerald-50'/>

        <div className=' absolute top-0 left-1/4 w-[320px] h-[320px] 
        bg-purple-200/40 blur-3xl rounded-full'/>

        <div className=' absolute bottom-0 right-1/4 w-[320px] h-[320px]
        bg-emerald-200/40 blur-3xl rounded-full' />

        <div className=' relative max-w-6xl mx-auto'>
          <div className=' flex justify-center'>
            <span className=' inline-flex items-center gap-2 bg-white
            border border-purple-100 shadow-sm text-purple-600 text-xs
            sm:text-sm font-semibold px-4 py-2 rounded-full'>

              <span className='w-2 h-2 bg-emerald-400 rounded-full' />
              Voice Ai for modern website

            </span>
          </div>

          <div className='text-center mt-10 sm:mt-12'>
            <h1 className=' max-w-5xl mx-auto text-[42px] leading-[52px]
            sm:text-6xl sm:leading-[72px] lg:text-7xl lg:leading-[88px]
            font-black traking-[-0.04em] text-[#081028]'>
              Add a{" "}
              <span className='inline-block px-2'>
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-emerald-500'>
                  Virtual Assistant

                </span>

              </span>
              <br className=' hidden sm:block' />
              to your website

            </h1>

            <p className=' max-w-2xl mx-auto mt-7 text-sm sm:text-lg
                lg:text-xl text-[#64748b] leading-relaxed px-2'>
              Create a smart voice-enabled  assistant that talks to visitors,
              answer questions and helps user navigate your website instantly.
            </p>

            <div className=' flex flex-col sm:flex-row items-center justify-center gap-4 mt-10'>
              <button onClick={() => navigate("/builder")} className='w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500
                to-emerald-500 text-white font-semibol text-sm sm:text-base shadow-[0_12px_40px_rgba(168,85,247,0.25)] hover:scale-[1.02] transition-all cursor-pointer'>
                Build Your Assistant
              </button>
            </div>

            <p className=' mt-5 text-xs:text-sm text-gray-400'>
              Free plan include 200 Ai responses
            </p>
          </div>

          <AssistantPreview />


        </div>

      </section>

      <section id='how-it-works' className='px-4 sm:px-6 lg:px-8 py-20 bg-white'>
        <div className='max-w-5xl mx-auto'>
          <div className='text-center mb-14 '>

            <h2 className='text-3xl sm:text-4xl font-bold text-[#081028]'>
              Get started in minutes
            </h2>

            <p className='text-gray-500 mt-3 text-sm sm:text-base'>
              Simple setup. No complicated integration.
            </p>

          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {STEPS.map((s, i) => (
              <div key={i} className='group bg-[#f8fafc] hover:bg-white border border-gray-100 
                    rounded-[28px] p-6 transition-all hover:shadow-[0_15px_50px_rgba(0,0,0,0.86)]'>
                <span className='text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-500
                        to-emerald-500 '>{s.step}</span>
                <h3 className='mt-5 text-lg font-semibold text-[#081028]'>{s.title}</h3>
                <p className='mt-3 text-sm text-gray-500 leading-relaxed '>{s.desc}</p>
              </div>
            ))}
          </div>

        </div>


      </section>


      <footer className='bg-[#081028] px-6 pt-14 pb-7 text-white sm:px-8'>
        <div className='mx-auto max-w-6xl'>
          <div className='grid gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]'>
            <div>
              <a href='#top' aria-label='NexaAI home' className='inline-flex items-center gap-3'>
                <img src={logo} alt='' className='h-11 w-11 rounded-xl object-cover' />
                <span className='text-xl font-bold tracking-tight'>
                  Nexa<span className='bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent'>AI</span>
                </span>
              </a>
              <p className='mt-4 max-w-sm text-sm leading-6 text-slate-400'>
                A voice assistant that helps your website welcome visitors and answer questions, around the clock.
              </p>
            </div>

            <nav aria-label='Footer navigation'>
              <h2 className='text-sm font-semibold uppercase tracking-wider text-white'>Explore</h2>
              <ul className='mt-4 space-y-3 text-sm text-slate-400'>
                <li><Link to='/builder' className='transition-colors hover:text-white'>Build your assistant</Link></li>
                <li><a href='#how-it-works' className='transition-colors hover:text-white'>How it works</a></li>
              </ul>
            </nav>

            <div>
              <h2 className='text-sm font-semibold uppercase tracking-wider text-white'>Follow us</h2>
              <p className='mt-4 text-sm leading-6 text-slate-400'>
                Join the conversation and follow NexaAI on social media.
              </p>
              <ul className='mt-5 flex flex-wrap gap-3'>
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target='_blank'
                      rel='noreferrer'
                      aria-label={`NexaAI on ${label}`}
                      title={label}
                      className='flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all hover:-translate-y-0.5 hover:border-purple-400/50 hover:bg-purple-500/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400'
                    >
                      <Icon aria-hidden='true' size={17} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className='flex flex-col gap-3 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between'>
            <p>© {new Date().getFullYear()} NexaAI. All rights reserved.</p>
            <a href='#top' className='w-fit transition-colors hover:text-white'>Back to top ↑</a>
          </div>
        </div>
      </footer>


    </div>
  )
}

export default Home
