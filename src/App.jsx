import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './supabase'

function App() {
useEffect(() => {
  const loadData = async () => {
    const { data: meetingsData, error: meetingsError } = await supabase
      .from('meeting_notes')
      .select('*')

    if (meetingsError) {
      console.error('Error al cargar notas:', meetingsError)
    } else {
      setMeetingNotes(meetingsData)
    }

    const { data: stepsData, error: stepsError } = await supabase
      .from('next_steps')
      .select('*')

    if (stepsError) {
      console.error('Error al cargar actividades:', stepsError)
    } else {
      setNextSteps(stepsData)
    }
        const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')

    if (projectsError) {
      console.error('Error al cargar proyectos:', projectsError)
    } else {
      setProjects(projectsData)

      if (projectsData.length > 0) {
        setSelectedProject(projectsData[0])
      }
    }
  }

  loadData()
}, [])

  const [activeSection, setActiveSection] = useState('overview')
  const [userMode, setUserMode] = useState('client')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState(null)
  const [projects, setProjects] = useState([])
const [selectedProject, setSelectedProject] = useState(null)
  const [showStepForm, setShowStepForm] = useState(false)
  const [showMeetingForm, setShowMeetingForm] = useState(false)
  const [showInfoForm, setShowInfoForm] = useState(false)
  const [showModelForm, setShowModelForm] = useState(false)

const [newModel, setNewModel] = useState({
  name: '',
  updated: '',
  status: 'En proceso',
})

const [newInfo, setNewInfo] = useState({
  name: '',
  status: 'Pendiente',
})

const [newMeeting, setNewMeeting] = useState({
  date: '',
  title: '',
  description: '',
  agreements: '',
})
  const [newStep, setNewStep] = useState({
  task: '',
  responsible: 'Cliente',
  date: '',
  status: 'Pendiente',
})

  const [nextSteps, setNextSteps] = useState([
    {
      task: 'Enviar detalle de ventas por línea de negocio',
      responsible: 'Cliente',
      date: '29 Oct 2026',
      status: 'Pendiente',
    },
    {
      task: 'Actualizar proyecciones financieras',
      responsible: 'BIE Asesores',
      date: '30 Oct 2026',
      status: 'En proceso',
    },
    {
      task: 'Revisar resultados de valuación',
      responsible: 'BIE Asesores',
      date: '31 Oct 2026',
      status: 'Próximo',
    },
  ])

const [meetingNotes, setMeetingNotes] = useState([])

  const [receivedInfo, setReceivedInfo] = useState([
    'Estados financieros 2023',
    'Estados financieros 2024',
    'Balance general 2025',
    'Detalle de costos y gastos',
    'Proyecciones preliminares',
  ])

  const [pendingInfo, setPendingInfo] = useState([
    'Ventas por línea de negocio',
    'Detalle de CAPEX 2025–2026',
    'Información de deuda bancaria',
  ])

  const [models, setModels] = useState([
    {
      name: 'Modelo financiero',
      updated: '26 Oct 2026',
      status: 'En revisión',
    },
    {
      name: 'Valuación DCF',
      updated: '24 Oct 2026',
      status: 'En proceso',
    },
    {
      name: 'Múltiplos comparables',
      updated: '24 Oct 2026',
      status: 'Completado',
    },
  ])
const handleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Error al iniciar sesión:', error)
    return
  }
  

  setSession(data.session)
  setUserMode('bie')
}

return (
  <>
   {userMode === 'login' && !session && (
    <div className="login-box">
      <h2>Acceso BIE</h2>

      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Iniciar sesión
      </button>
    </div>
  )} 
    <div className="app">
      <aside className="sidebar">
       <div className="brand">
  <img
    src="/logo bie.avif"
    alt="BIE Asesores"
    className="brand-logo"
  />
</div>

        <nav>
          <button
            className={activeSection === 'overview' ? 'active' : ''}
            onClick={() => setActiveSection('overview')}
          >
            Resumen del proyecto
          </button>

          <button
            className={activeSection === 'meetings' ? 'active' : ''}
            onClick={() => setActiveSection('meetings')}
          >
            Notas de juntas
          </button>

          <button
            className={activeSection === 'steps' ? 'active' : ''}
            onClick={() => setActiveSection('steps')}
          >
            Siguientes pasos
          </button>

          <button
            className={activeSection === 'information' ? 'active' : ''}
            onClick={() => setActiveSection('information')}
          >
            Información
          </button>

          <button
            className={activeSection === 'models' ? 'active' : ''}
            onClick={() => setActiveSection('models')}
          >
            Modelos trabajados
          </button>
        </nav>

        <div className="sidebar-footer">
          <span>Portal confidencial</span>
          <p>Última actualización</p>
          <strong>27 Oct 2026</strong>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="view-switcher">
  <button
    className={userMode === 'client' ? 'selected' : ''}
    onClick={() => setUserMode('client')}
  >
    Vista Cliente
  </button>

  <button
  className={userMode === 'bie' ? 'selected' : ''}
  onClick={() => {
    if (session) {
      setUserMode('bie')
    } else {
      setUserMode('login')
    }
  }}
>
  Vista BIE
</button>
</div>
{userMode === 'bie' && projects.length > 0 && (
  <div className="project-selector">
    <label>Proyecto</label>

    <select
      value={selectedProject?.id || ''}
     onChange={async (e) => {
  const project = projects.find(
    (item) => item.id === Number(e.target.value)
  )

  setSelectedProject(project)

  const { data, error } = await supabase
    .from('meeting_notes')
    .select('*')
    .eq('project_id', project.id)

  if (error) {
    console.error('Error al cargar notas del proyecto:', error)
  } else {
    setMeetingNotes(data)
  }
  const { data: stepsData, error: stepsError } = await supabase
  .from('next_steps')
  .select('*')
  .eq('project_id', project.id)

if (stepsError) {
  console.error('Error al cargar actividades del proyecto:', stepsError)
} else {
  setNextSteps(stepsData)
}
}}
    >
      {projects.map((project) => (
        <option key={project.id} value={project.id}>
          {project.name} — {project.client_name}
        </option>
      ))}
    </select>
  </div>
)}
  <div>
  <p className="eyebrow">PROYECTO CONFIDENCIAL</p>
  <h2>{selectedProject?.name || 'Selecciona un proyecto'}</h2>
  <p className="subtitle">
    {selectedProject?.service_type || ''}
  </p>
</div>

<div className="client">
  <span>Cliente</span>
  <strong>
    {selectedProject?.client_name || ''}
  </strong>
</div>        

         
        </header>
        {userMode === 'bie' && (
  <section className="admin-bar">
    <div>
      <span className="admin-label">MODO ADMINISTRACIÓN</span>
      <strong>Panel interno BIE</strong>
      <p>
        Actualiza la información que estará disponible para el cliente.
      </p>
    </div>

    <div className="admin-actions">
    <button
  onClick={() => {
    setActiveSection('meetings')
    setShowMeetingForm(true)
  }}
>
  + Nota de junta
</button>

     <button
        onClick={() => {
            setActiveSection('steps')
            setShowStepForm(true)
  }}
>
        + Siguiente paso
        </button>

      <button
  onClick={() => {
    setActiveSection('information')
    setShowInfoForm(true)
  }}
>
  + Información
</button>

  <button
    onClick={() => {
    setActiveSection('models')
    setShowModelForm(true)
  }}
>
  + Modelo
</button>
    </div>
  </section>
)}

        {activeSection === 'overview' && (
          <>
            <section className="hero">
              <div>
                <span className="status-pill">En proceso</span>
                <h3>Resumen del proyecto</h3>
                <p>
                  Seguimiento centralizado del proceso de valuación y de la
                  información requerida para continuar con el análisis.
                </p>
              </div>

              <div className="progress-box">
                <span>Avance general</span>
                <strong>65%</strong>
                <div className="progress">
                  <div className="progress-fill"></div>
                </div>
              </div>
            </section>

            <section className="metrics">
              <div className="metric-card">
                <span>Etapa actual</span>
                <strong>Modelo financiero</strong>
                <p>Actualización de proyecciones</p>
              </div>

              <div className="metric-card">
                <span>Próxima actividad</span>
                <strong>Revisión de valuación</strong>
                <p>31 Oct 2026</p>
              </div>

              <div className="metric-card">
                <span>Información pendiente</span>
                <strong>3 documentos</strong>
                <p>Por parte del cliente</p>
              </div>

              <div className="metric-card">
                <span>Última junta</span>
                <strong>24 Oct 2026</strong>
                <p>Junta de seguimiento</p>
              </div>
            </section>

            <section className="overview-grid">
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <p className="section-label">PRÓXIMAS ACTIVIDADES</p>
                    <h3>Siguientes pasos</h3>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => setActiveSection('steps')}
                  >
                    Ver todos
                  </button>
                </div>

                {nextSteps.slice(0, 3).map((step) => (
                  <div className="step-row" key={step.task}>
                    <div>
                      <strong>{step.task}</strong>
                      <p>
                        {step.responsible} · {step.date}
                      </p>
                    </div>
                    <span className={`tag ${step.status.toLowerCase().replace(' ', '-')}`}>
                      {step.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <p className="section-label">INFORMACIÓN</p>
                    <h3>Estatus de documentos</h3>
                  </div>
                </div>

                <div className="document-summary">
                  <div>
                    <span className="summary-number">{receivedInfo.length}</span>
                    <p>Recibidos</p>
                  </div>

                  <div>
                    <span className="summary-number pending-number">
                      {pendingInfo.length}
                    </span>
                    <p>Pendientes</p>
                  </div>
                </div>

                <button
                  className="primary-button"
                  onClick={() => setActiveSection('information')}
                >
                  Consultar información
                </button>
              </div>
            </section>
          </>
        )}

        {activeSection === 'meetings' && (
          <section className="content-section">
            <p className="section-label">HISTORIAL</p>
            <h3>Notas de juntas</h3>
            <p className="section-description">
              Consulta los principales temas, acuerdos y decisiones de las
              reuniones del proyecto.
            </p>
{userMode === 'bie' && showMeetingForm && (
  <div className="admin-form">
    <h4>Agregar nota de junta</h4>

    <div className="form-field">
      <label>Fecha</label>
      <input
        type="date"
        value={newMeeting.date}
        onChange={(e) =>
          setNewMeeting({ ...newMeeting, date: e.target.value })
        }
      />
    </div>

    <div className="form-field">
      <label>Título de la junta</label>
      <input
        type="text"
        placeholder="Ej. Junta de seguimiento"
        value={newMeeting.title}
        onChange={(e) =>
          setNewMeeting({ ...newMeeting, title: e.target.value })
        }
      />
    </div>

    <div className="form-field">
      <label>Temas revisados</label>
      <textarea
        placeholder="Describe los principales temas revisados..."
        value={newMeeting.description}
        onChange={(e) =>
          setNewMeeting({ ...newMeeting, description: e.target.value })
        }
      />
    </div>

    <div className="form-field">
      <label>Acuerdos y siguientes pasos</label>
      <textarea
        placeholder="Escribe los acuerdos y siguientes pasos..."
        value={newMeeting.agreements}
        onChange={(e) =>
          setNewMeeting({ ...newMeeting, agreements: e.target.value })
        }
      />
    </div>

    <div className="form-actions">
      <button onClick={() => setShowMeetingForm(false)}>
        Cancelar
      </button>

<button
  onClick={async () => {
    const { data, error } = await supabase
      .from('meeting_notes')
     .insert([
  {
    ...newMeeting,
    project_id: selectedProject.id,
  },
])
      .select()

    if (error) {
      console.error('Error al guardar nota:', error)
      return
    }

    setMeetingNotes([data[0], ...meetingNotes])

    setNewMeeting({
      date: '',
      title: '',
      description: '',
      agreements: '',
    })

    setShowMeetingForm(false)
  }}
>
  Guardar nota
</button>
    </div>
  </div>
)}
            <div className="meeting-list">
              {meetingNotes.map((meeting) => (
                <article className="meeting-card" key={meeting.date}>
                  <div className="meeting-date">{meeting.date}</div>
                  <div>
                    <h4>{meeting.title}</h4>
                    <p>{meeting.description}</p>
                    <div className="agreement">
                      <strong>Acuerdos y siguientes pasos</strong>
                      <p>{meeting.agreements}</p>
                    </div>
                  {userMode === 'bie' && (
  <button
    onClick={() => {
      const updatedMeetings = meetingNotes.filter(
        (item) =>
          !(
            item.date === meeting.date &&
            item.title === meeting.title
          )
      )
      setMeetingNotes(updatedMeetings)
    }}
  >
    Eliminar
  </button>
)}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'steps' && (
          <section className="content-section">
            <p className="section-label">SEGUIMIENTO</p>
            <h3>Siguientes pasos</h3>
            <p className="section-description">
              Actividades acordadas, responsables y fechas de seguimiento.
            </p>
            {userMode === 'bie' && showStepForm && (
  <div className="admin-form">
    <h4>Agregar siguiente paso</h4>

    <div className="form-field">
      <label>Actividad</label>
    <input
      type="text"
      placeholder="Ej. Enviar información financiera actualizada"
      value={newStep.task}
      onChange={(e) =>
    setNewStep({ ...newStep, task: e.target.value })
  }
/>
    </div>

    <div className="form-field">
      <label>Responsable</label>
      <select
        value={newStep.responsible}
        onChange={(e) =>
          setNewStep({ ...newStep, responsible: e.target.value })
      }
  >
    <option>Cliente</option>
    <option>BIE Asesores</option>
    <option>Cliente / BIE</option>
</select>
    </div>

    <div className="form-field">
      <label>Fecha</label>
      <input
        type="date"
        value={newStep.date}
        onChange={(e) =>
          setNewStep({ ...newStep, date: e.target.value })
    }
/>
    </div>

    <div className="form-field">
      <label>Estatus</label>
      <select
  value={newStep.status}
  onChange={(e) =>
    setNewStep({ ...newStep, status: e.target.value })
  }
>
  <option>Pendiente</option>
  <option>En proceso</option>
  <option>Próximo</option>
</select>
    </div>

    <div className="form-actions">
      <button onClick={() => setShowStepForm(false)}>
        Cancelar
      </button>

<button
  onClick={async () => {
    const { data, error } = await supabase
  .from('next_steps')
  .insert([
    {
      ...newStep,
      project_id: selectedProject.id,
    },
  ])
  .select()

    if (error) {
      console.error('Error al guardar actividad:', error)
      return
    }

    setNextSteps([...nextSteps, data[0]])

    setNewStep({
      task: '',
      responsible: 'Cliente',
      date: '',
      status: 'Pendiente',
    })

    setShowStepForm(false)
  }}
>
  Guardar actividad
</button>
    </div>
  </div>
)}

            <div className="table">
             <div className="table-row table-header">
  <span>Actividad</span>
  <span>Responsable</span>
  <span>Fecha</span>
  <span>Estatus</span>
  {userMode === 'bie' && <span>Acción</span>}
</div>

              {nextSteps.map((step) => (
                <div className="table-row" key={step.task}>
                  <strong>{step.task}</strong>
                  <span>{step.responsible}</span>
                  <span>{step.date}</span>
                 <span>
  {userMode === 'bie' ? (
    <select
      value={step.status}
      onChange={(e) => {
        const updatedSteps = nextSteps.map((item) =>
          item.task === step.task
            ? { ...item, status: e.target.value }
            : item
        )
        setNextSteps(updatedSteps)
      }}
    >
      <option>Pendiente</option>
      <option>En proceso</option>
      <option>Próximo</option>
      <option>Completado</option>
    </select>
  ) : (
    <span
      className={`tag ${step.status
        .toLowerCase()
        .replace(' ', '-')}`}
    >
      {step.status}
    </span>
  )}
</span>
{userMode === 'bie' && (
  <button
    onClick={() => {
      const updatedSteps = nextSteps.filter(
        (item) => item.task !== step.task
      )
      setNextSteps(updatedSteps)
    }}
  >
    Eliminar
  </button>
)}
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'information' && (
          <section className="content-section">
            <p className="section-label">DOCUMENTACIÓN</p>
            <h3>Información del proyecto</h3>
            <p className="section-description">
              Seguimiento de la información proporcionada y de los documentos
              que continúan pendientes.
            </p>
            {userMode === 'bie' && showInfoForm && (
  <div className="admin-form">
    <h4>Agregar información</h4>

    <div className="form-field">
      <label>Documento o información</label>
      <input
        type="text"
        placeholder="Ej. Estados financieros 2025"
        value={newInfo.name}
        onChange={(e) =>
          setNewInfo({ ...newInfo, name: e.target.value })
        }
      />
    </div>

    <div className="form-field">
      <label>Estatus</label>
      <select
        value={newInfo.status}
        onChange={(e) =>
          setNewInfo({ ...newInfo, status: e.target.value })
        }
      >
        <option>Pendiente</option>
        <option>Recibida</option>
      </select>
    </div>
    <div className="form-field">
      <label>Archivo</label>
      <input
        type="file"
        accept=".pdf,.xlsx,.xls,.doc,.docx,.ppt,.pptx,.csv"
      />
    </div>
    <div className="form-actions">
      <button onClick={() => setShowInfoForm(false)}>
        Cancelar
      </button>

    <button
  onClick={() => {
    if (newInfo.status === 'Recibida') {
      setReceivedInfo([...receivedInfo, newInfo.name])
    } else {
      setPendingInfo([...pendingInfo, newInfo.name])
    }

    setNewInfo({
      name: '',
      status: 'Pendiente',
    })

    setShowInfoForm(false)
  }}
>
  Guardar información
</button>
    </div>
  </div>
)}

            <div className="info-grid">
              <div className="panel">
                <h4>Información recibida</h4>
               {receivedInfo.map((item) => (
  <div className="info-item received" key={item}>
    <span>✓</span>
    <p>{item}</p>

   {userMode === 'bie' && (
  <div className="info-actions">
    <button
      onClick={() => {
        setReceivedInfo(
          receivedInfo.filter(
            (receivedItem) => receivedItem !== item
          )
        )

        setPendingInfo([...pendingInfo, item])
      }}
    >
      Marcar como pendiente
    </button>

    <button
      onClick={() => {
        setReceivedInfo(
          receivedInfo.filter(
            (receivedItem) => receivedItem !== item
          )
        )
      }}
    >
      Eliminar
    </button>
  </div>
)}
  </div>
))}
              </div>

              <div className="panel">
                <h4>Información pendiente</h4>
             {pendingInfo.map((item) => (
  <div className="info-item pending-info" key={item}>
    <span>!</span>
    <p>{item}</p>
{userMode === 'bie' && (
  <div className="info-actions">
    <button
      onClick={() => {
        setPendingInfo(
          pendingInfo.filter(
            (pendingItem) => pendingItem !== item
          )
        )

        setReceivedInfo([...receivedInfo, item])
      }}
    >
      Marcar como recibida
    </button>

    <button
      onClick={() => {
        setPendingInfo(
          pendingInfo.filter(
            (pendingItem) => pendingItem !== item
          )
        )
      }}
    >
      Eliminar
    </button>
  </div>
)}
  </div>
))}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'models' && (
          <section className="content-section">
            <p className="section-label">ANÁLISIS</p>
            <h3>Modelos trabajados</h3>
            <p className="section-description">
              Consulta el avance de los principales modelos y análisis
              desarrollados durante el proyecto.
            </p>
            {userMode === 'bie' && showModelForm && (
  <div className="admin-form">
    <h4>Agregar modelo</h4>

    <div className="form-field">
      <label>Nombre del modelo</label>
      <input
        type="text"
        placeholder="Ej. Valuación por múltiplos"
        value={newModel.name}
        onChange={(e) =>
          setNewModel({ ...newModel, name: e.target.value })
        }
      />
    </div>

    <div className="form-field">
      <label>Última actualización</label>
      <input
        type="date"
        value={newModel.updated}
        onChange={(e) =>
          setNewModel({ ...newModel, updated: e.target.value })
        }
      />
    </div>

    <div className="form-field">
      <label>Estatus</label>
      <select
        value={newModel.status}
        onChange={(e) =>
          setNewModel({ ...newModel, status: e.target.value })
        }
      >
        <option>En proceso</option>
        <option>En revisión</option>
        <option>Completado</option>
      </select>
    </div>

    <div className="form-actions">
      <button onClick={() => setShowModelForm(false)}>
        Cancelar
      </button>

    <button
  onClick={() => {
    setModels([...models, newModel])

    setNewModel({
      name: '',
      updated: '',
      status: 'En proceso',
    })

    setShowModelForm(false)
  }}
>
  Guardar modelo
</button>
    </div>
  </div>
)}

            <div className="models-grid">
              {models.map((model) => (
                <article className="model-card" key={model.name}>
                  <div className="model-icon">BIE</div>
                  <h4>{model.name}</h4>
                  <p>Última actualización</p>
                  <strong>{model.updated}</strong>
                  {userMode === 'bie' ? (
  <select
    value={model.status}
    onChange={(e) => {
      const updatedModels = models.map((item) =>
        item.name === model.name
          ? { ...item, status: e.target.value }
          : item
      )
      setModels(updatedModels)
    }}
  >
    <option>En proceso</option>
    <option>En revisión</option>
    <option>Completado</option>
  </select>
) : (
  <span className="model-status">{model.status}</span>
)}
{userMode === 'bie' && (
  <button
    onClick={() => {
      const updatedModels = models.filter(
        (item) => item.name !== model.name
      )
      setModels(updatedModels)
    }}
  >
    Eliminar
  </button>
)}
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  </>
  )
}

export default App