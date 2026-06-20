// Camada interfaces — UI do side panel (placeholder do walking skeleton).
// Sem lógica de curadoria ainda; o diagnóstico/score/checklist entram nas features seguintes.
export function App() {
  return (
    <main
      data-testid="curadoria-placeholder"
      style={{ fontFamily: 'system-ui, sans-serif', padding: 16, lineHeight: 1.5 }}
    >
      <h1 style={{ fontSize: 18, margin: '0 0 8px' }}>Curador de Perfil</h1>
      <p style={{ margin: 0, color: '#555' }}>Aguardando análise do perfil</p>
    </main>
  );
}
