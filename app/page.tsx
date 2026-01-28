"use client"

import { useState } from "react"
import { Plus, Trash2, Users, Calculator, Sparkles } from "lucide-react"

interface Participante {
  id: number
  nombre: string
  monto: number
}

interface Deuda {
  de: string
  para: string
  monto: number
}

export default function Home() {
  const [participantes, setParticipantes] = useState<Participante[]>([])
  const [nombre, setNombre] = useState("")
  const [monto, setMonto] = useState("")
  const [nextId, setNextId] = useState(1)

  const agregarParticipante = () => {
    if (nombre.trim() && monto.trim()) {
      setParticipantes([
        ...participantes,
        { id: nextId, nombre: nombre.trim(), monto: parseFloat(monto) },
      ])
      setNextId(nextId + 1)
      setNombre("")
      setMonto("")
    }
  }

  const eliminarParticipante = (id: number) => {
    setParticipantes(participantes.filter((p) => p.id !== id))
  }

  const calcularDeudas = (): Deuda[] => {
    if (participantes.length < 2) return []

    const total = participantes.reduce((sum, p) => sum + p.monto, 0)
    const promedio = total / participantes.length

    const balances = participantes.map((p) => ({
      nombre: p.nombre,
      balance: p.monto - promedio,
    }))

    const deudores = balances
      .filter((b) => b.balance < 0)
      .sort((a, b) => a.balance - b.balance)

    const acreedores = balances
      .filter((b) => b.balance > 0)
      .sort((a, b) => b.balance - a.balance)

    const deudas: Deuda[] = []

    let i = 0
    let j = 0

    while (i < deudores.length && j < acreedores.length) {
      const deuda = Math.min(-deudores[i].balance, acreedores[j].balance)

      if (deuda > 0.01) {
        deudas.push({
          de: deudores[i].nombre,
          para: acreedores[j].nombre,
          monto: Math.round(deuda * 100) / 100,
        })
      }

      deudores[i].balance += deuda
      acreedores[j].balance -= deuda

      if (Math.abs(deudores[i].balance) < 0.01) i++
      if (Math.abs(acreedores[j].balance) < 0.01) j++
    }

    return deudas
  }

  const deudas = calcularDeudas()

  return (
    <div className="min-h-screen bg-background pt-14">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="La Cuenta Clara"
              className="h-35 w-35 object-contain"
            />
            
          </div>

          <nav className="flex items-center gap-6">
            <a
              href="#como-funciona"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cómo funciona
            </a>
            <a
              href="#calcular"
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:opacity-90 transition-opacity"
            >
              Empezar
            </a>
          </nav>
        </div>
      </header>

      {/* Hero (compacto + portada con tinte rojo suave) */}
      <section className="relative isolate overflow-hidden pt-10 pb-10 sm:pt-12 sm:pb-12">
        {/* Fondo (NO puede capturar clicks) */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <img
            src="/images/portada.png"
            alt=""
            className="h-full w-full object-cover object-[50%_88%]"
          />

          {/* overlay rojo MUY suave */}
          <div className="absolute inset-0 bg-primary/22" />

          {/* degradado sutil para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />
        </div>

        {/* Contenido */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-10 sm:pt-14">
          <div className="mb-3">
            <p className="text-white/90 text-xs sm:text-sm tracking-wide">
              Nadie paga de más, nadie se hace el dolobu.
            </p>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 text-balance drop-shadow-lg">
            Que las deudas no arruinen la amistad.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-white/90">
            Dividí gastos en segundos y listo.
          </p>
        </div>
      </section>

      {/* Calcular Section */}
      <section id="calcular" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Calculá los gastos
            </h2>
            <p className="text-muted-foreground text-lg">
              Simple, rápido y sin vueltas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Agregar aporte */}
            <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">
                  Agregar aporte
                </h3>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                  type="number"
                  placeholder="¿Cuánto puso?"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={agregarParticipante}
                  className="w-full px-4 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Agregar
                </button>
              </div>
            </div>

            {/* Card 2: Participantes */}
            <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">
                  Participantes
                </h3>
              </div>

              {participantes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Todavía no hay nadie</p>
                </div>
              ) : (
                <ul className="space-y-3 max-h-64 overflow-y-auto">
                  {participantes.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted"
                    >
                      <div>
                        <span className="font-medium text-foreground">
                          {p.nombre}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          ${p.monto.toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => eliminarParticipante(p.id)}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Card 3: Resultado */}
            <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">
                  Resultado
                </h3>
              </div>

              {participantes.length < 2 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calculator className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Agregá al menos 2 personas para calcular.</p>
                </div>
              ) : deudas.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 text-primary" />
                  <p className="text-foreground font-medium">¡Están todos parejos!</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {deudas.map((d, i) => (
                    <li key={i} className="p-3 rounded-xl bg-primary/10">
                      <span className="font-medium text-foreground">{d.de}</span>
                      <span className="text-muted-foreground"> le debe </span>
                      <span className="font-bold text-primary">
                        ${d.monto.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground"> a </span>
                      <span className="font-medium text-foreground">{d.para}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="py-24 px-6 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-muted-foreground text-lg">Tres pasos y listo.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                1
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Cargás quién puso qué
              </h3>
              <p className="text-muted-foreground">
                Agregá a cada persona y cuánto aportó.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                2
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                La app calcula el promedio
              </h3>
              <p className="text-muted-foreground">Automáticamente saca las cuentas.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                3
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Te dice quién le debe a quién
              </h3>
              <p className="text-muted-foreground">Claro, directo y sin dramas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-background border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <a
            href="https://cafecito.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:opacity-90 transition-opacity mb-8"
          >
            Invitame un cafecito ☕
          </a>
          <p className="text-muted-foreground">
            Hecho con <span className="text-primary">♥</span> por Agustín Luque
          </p>
        </div>
      </footer>
    </div>
  )
}
