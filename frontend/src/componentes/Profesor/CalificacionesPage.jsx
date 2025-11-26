import { useEffect, useState } from "react";
import { apiFetch, calificar } from "./api";
import { MiniComponenteLoading } from "../PantallaLoading/ComponenteLoading";
export default function CalificacionesPage() {
  // const token = localStorage.getItem("token");
  const [entregas, setEntregas] = useState([]);
  const [notas, setNotas] = useState({});
  const [requestFinalizada, setRequestFinalizada] = useState(false);
  const [refrescar, setRefrescar ] = useState(false)

  useEffect(() => { 
    apiFetch("/profesor/entregas/",  ).then(setEntregas).catch(setRequestFinalizada(true))
    setRequestFinalizada(true)
    setRefrescar(false)
    }, [refrescar]);
    
    useEffect(() => { 
    console.log(entregas)
    }, [entregas]);

    if(requestFinalizada && entregas.length === 0) return <><MiniComponenteLoading /></>

  const funcCalificar = async (entregaId) => {
    const body = { entrega: entregaId, nota: Number(notas[entregaId] || 0) };
    const res = await calificar(`/profesor/calificaciones/${entregaId}/`, body);
    alert(`Calificada con nota ${res.nota}`);
    console.log(res)
  };



  return (
    <div>
      <h1 className="text-xl font-bold mb-3">Calificaciones</h1>
      {entregas.length === 0 ? <p>No tienes entregas aún.</p> :
        <ul className="space-y-2">
        {entregas.map(e => (
          <li key={e.id} className="border rounded p-3"> 
            <div className="font-semibold">Entrega #{e.id}</div>
            {entregas.nota > 0 || entregas.notas === undefined ?
            <><input className="text-white bg-gray-50 border border-gray-300 rounded-2xl w-full max-w-60 h-auto p-0.5 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              placeholder="Nota"
              value={notas[e.id] ?? ""} onChange={(ev)=>setNotas({...notas, [e.id]: ev.target.value})}/></>
              : <><p>{entregas.nota}</p></>}
              <button className="px-3 py-1 rounded border" onClick={()=>{funcCalificar(e.id), setRefrescar(true)}}>Guardar</button>

          </li>
        ))}
      </ul>
      }
    </div>
  );
}

