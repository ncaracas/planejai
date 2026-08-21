import {
  type SimulationFormData,
  type SimulationRecord,
} from '@/data/simulation'

const LOCAL_STORAGE_KEY = 'simulation-data'

export const useSimulationStorage = () => {
  const getSimulations = (): SimulationRecord[] => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (!storage) {
      return []
    }

    const savedData = JSON.parse(storage) as SimulationRecord[]
    let hasLegacyRecords = false

    const normalizedData = savedData.map((record) => {
      if (record.createdAt) {
        return record
      }

      hasLegacyRecords = true
      return {
        ...record,
        createdAt: new Date().toISOString(),
      } as SimulationRecord
    })

    if (hasLegacyRecords) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(normalizedData))
    }

    return normalizedData
  }

  const saveFormData = (formData: SimulationFormData) => {
    const id = crypto.randomUUID()
    const record: SimulationRecord = {
      ...formData,
      id,
      createdAt: new Date().toISOString(),
    }

    const savedData = getSimulations()

    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify([...savedData, record]),
    )

    return id
  }

  const getFormData = (id: string) => {
    const savedData = getSimulations()
    return savedData.find((record) => record.id === id) || null
  }

  const deleteSimulation = (id: string) => {
    const simulations = getSimulations().filter((record) => record.id !== id)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(simulations))
  }

  const updateSimulation = (id: string, data: SimulationRecord) => {
    const savedData = getSimulations()

    const updated = savedData.map((record) =>
      record.id === id ? { ...data } : record,
    )

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  }

  return {
    saveFormData,
    getFormData,
    getSimulations,
    deleteSimulation,
    updateSimulation,
  }
}
