import AsyncStorage from "@react-native-async-storage/async-storage";

export type Language = "en" | "es" | "fr";

export interface TranslationKeys {
  // Common
  common: {
    appName: string;
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
    next: string;
    back: string;
    skip: string;
    submit: string;
    done: string;
  };

  // Navigation
  navigation: {
    home: string;
    settings: string;
    profile: string;
    leaderboard: string;
    search: string;
    notifications: string;
    analytics: string;
  };

  // Worker Role
  worker: {
    reportIncident: string;
    reportTypes: {
      harassment: string;
      wageTheft: string;
      unsafeConditions: string;
      trafficking: string;
      discrimination: string;
      childLabor: string;
    };
    anonymousReport: string;
    reportId: string;
    escalationPath: string;
    trackReport: string;
    reportStatus: string;
  };

  // Community Guardian Role
  communityGuardian: {
    reportIncident: string;
    incidentTypes: {
      endangered: string;
      habitat: string;
      pollution: string;
      poaching: string;
      deforestation: string;
    };
    biodiversityMap: string;
    hotspots: string;
    protectionZones: string;
    trackIncident: string;
  };

  // Consumer Role
  consumer: {
    scanProduct: string;
    productOrigin: string;
    workerInfo: string;
    fairWages: string;
    environmentalImpact: string;
    communityBenefits: string;
    shareStory: string;
  };

  // Business Role
  business: {
    supplyChain: string;
    supplierVerification: string;
    riskAssessment: string;
    esGReporting: string;
    complianceStatus: string;
  };

  // Features
  features: {
    qrScanner: string;
    leaderboard: string;
    achievements: string;
    rewards: string;
    impactMetrics: string;
    communityForum: string;
    impactStories: string;
    notifications: string;
  };

  // Community Features
  community: {
    forum: string;
    discussions: string;
    impactStories: string;
    voting: string;
    comments: string;
    likes: string;
    shares: string;
    createPost: string;
    createStory: string;
    joinDiscussion: string;
    viewStory: string;
    upvote: string;
    downvote: string;
  };

  // Settings
  settings: {
    language: string;
    notifications: string;
    darkMode: string;
    privacy: string;
    about: string;
    help: string;
    logout: string;
    changeRole: string;
  };

  // Messages
  messages: {
    welcome: string;
    thankYou: string;
    confirmDelete: string;
    noResults: string;
    tryAgain: string;
    connectionError: string;
    offline: string;
  };
}

const TRANSLATIONS: Record<Language, TranslationKeys> = {
  en: {
    common: {
      appName: "Guardian-IO",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      next: "Next",
      back: "Back",
      skip: "Skip",
      submit: "Submit",
      done: "Done",
    },
    navigation: {
      home: "Home",
      settings: "Settings",
      profile: "Profile",
      leaderboard: "Leaderboard",
      search: "Search",
      notifications: "Notifications",
      analytics: "Analytics",
    },
    worker: {
      reportIncident: "Report Incident",
      reportTypes: {
        harassment: "Harassment",
        wageTheft: "Wage Theft",
        unsafeConditions: "Unsafe Conditions",
        trafficking: "Trafficking",
        discrimination: "Discrimination",
        childLabor: "Child Labor",
      },
      anonymousReport: "Anonymous Report",
      reportId: "Report ID",
      escalationPath: "Escalation Path",
      trackReport: "Track Report",
      reportStatus: "Report Status",
    },
    communityGuardian: {
      reportIncident: "Report Incident",
      incidentTypes: {
        endangered: "Endangered Species",
        habitat: "Habitat Destruction",
        pollution: "Pollution",
        poaching: "Poaching",
        deforestation: "Deforestation",
      },
      biodiversityMap: "Biodiversity Map",
      hotspots: "Hotspots",
      protectionZones: "Protection Zones",
      trackIncident: "Track Incident",
    },
    consumer: {
      scanProduct: "Scan Product",
      productOrigin: "Product Origin",
      workerInfo: "Worker Information",
      fairWages: "Fair Wages",
      environmentalImpact: "Environmental Impact",
      communityBenefits: "Community Benefits",
      shareStory: "Share Story",
    },
    business: {
      supplyChain: "Supply Chain",
      supplierVerification: "Supplier Verification",
      riskAssessment: "Risk Assessment",
      esGReporting: "ESG Reporting",
      complianceStatus: "Compliance Status",
    },
    features: {
      qrScanner: "QR Scanner",
      leaderboard: "Leaderboard",
      achievements: "Achievements",
      rewards: "Rewards",
      impactMetrics: "Impact Metrics",
      communityForum: "Community Forum",
      impactStories: "Impact Stories",
      notifications: "Notifications",
    },
    community: {
      forum: "Forum",
      discussions: "Discussions",
      impactStories: "Impact Stories",
      voting: "Voting",
      comments: "Comments",
      likes: "Likes",
      shares: "Shares",
      createPost: "Create Post",
      createStory: "Create Story",
      joinDiscussion: "Join Discussion",
      viewStory: "View Story",
      upvote: "Upvote",
      downvote: "Downvote",
    },
    settings: {
      language: "Language",
      notifications: "Notifications",
      darkMode: "Dark Mode",
      privacy: "Privacy",
      about: "About",
      help: "Help",
      logout: "Logout",
      changeRole: "Change Role",
    },
    messages: {
      welcome: "Welcome to Guardian-IO",
      thankYou: "Thank you for your contribution",
      confirmDelete: "Are you sure you want to delete this?",
      noResults: "No results found",
      tryAgain: "Try again",
      connectionError: "Connection error",
      offline: "You are offline",
    },
  },

  es: {
    common: {
      appName: "Guardian-IO",
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
      cancel: "Cancelar",
      save: "Guardar",
      delete: "Eliminar",
      edit: "Editar",
      close: "Cerrar",
      next: "Siguiente",
      back: "Atrás",
      skip: "Omitir",
      submit: "Enviar",
      done: "Hecho",
    },
    navigation: {
      home: "Inicio",
      settings: "Configuración",
      profile: "Perfil",
      leaderboard: "Clasificación",
      search: "Buscar",
      notifications: "Notificaciones",
      analytics: "Análisis",
    },
    worker: {
      reportIncident: "Reportar Incidente",
      reportTypes: {
        harassment: "Acoso",
        wageTheft: "Robo de Salario",
        unsafeConditions: "Condiciones Inseguras",
        trafficking: "Tráfico",
        discrimination: "Discriminación",
        childLabor: "Trabajo Infantil",
      },
      anonymousReport: "Reporte Anónimo",
      reportId: "ID de Reporte",
      escalationPath: "Ruta de Escalada",
      trackReport: "Rastrear Reporte",
      reportStatus: "Estado del Reporte",
    },
    communityGuardian: {
      reportIncident: "Reportar Incidente",
      incidentTypes: {
        endangered: "Especies en Peligro",
        habitat: "Destrucción del Hábitat",
        pollution: "Contaminación",
        poaching: "Caza Furtiva",
        deforestation: "Deforestación",
      },
      biodiversityMap: "Mapa de Biodiversidad",
      hotspots: "Puntos Críticos",
      protectionZones: "Zonas de Protección",
      trackIncident: "Rastrear Incidente",
    },
    consumer: {
      scanProduct: "Escanear Producto",
      productOrigin: "Origen del Producto",
      workerInfo: "Información del Trabajador",
      fairWages: "Salarios Justos",
      environmentalImpact: "Impacto Ambiental",
      communityBenefits: "Beneficios Comunitarios",
      shareStory: "Compartir Historia",
    },
    business: {
      supplyChain: "Cadena de Suministro",
      supplierVerification: "Verificación de Proveedores",
      riskAssessment: "Evaluación de Riesgos",
      esGReporting: "Reporte ESG",
      complianceStatus: "Estado de Cumplimiento",
    },
    features: {
      qrScanner: "Escáner QR",
      leaderboard: "Clasificación",
      achievements: "Logros",
      rewards: "Recompensas",
      impactMetrics: "Métricas de Impacto",
      communityForum: "Foro Comunitario",
      impactStories: "Historias de Impacto",
      notifications: "Notificaciones",
    },
    community: {
      forum: "Foro",
      discussions: "Discusiones",
      impactStories: "Historias de Impacto",
      voting: "Votación",
      comments: "Comentarios",
      likes: "Me Gusta",
      shares: "Compartir",
      createPost: "Crear Publicación",
      createStory: "Crear Historia",
      joinDiscussion: "Unirse a Discusión",
      viewStory: "Ver Historia",
      upvote: "Votar Positivo",
      downvote: "Votar Negativo",
    },
    settings: {
      language: "Idioma",
      notifications: "Notificaciones",
      darkMode: "Modo Oscuro",
      privacy: "Privacidad",
      about: "Acerca de",
      help: "Ayuda",
      logout: "Cerrar Sesión",
      changeRole: "Cambiar Rol",
    },
    messages: {
      welcome: "Bienvenido a Guardian-IO",
      thankYou: "Gracias por tu contribución",
      confirmDelete: "¿Estás seguro de que deseas eliminar esto?",
      noResults: "No se encontraron resultados",
      tryAgain: "Intentar de nuevo",
      connectionError: "Error de conexión",
      offline: "Estás sin conexión",
    },
  },

  fr: {
    common: {
      appName: "Guardian-IO",
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      cancel: "Annuler",
      save: "Enregistrer",
      delete: "Supprimer",
      edit: "Modifier",
      close: "Fermer",
      next: "Suivant",
      back: "Retour",
      skip: "Ignorer",
      submit: "Soumettre",
      done: "Terminé",
    },
    navigation: {
      home: "Accueil",
      settings: "Paramètres",
      profile: "Profil",
      leaderboard: "Classement",
      search: "Rechercher",
      notifications: "Notifications",
      analytics: "Analytique",
    },
    worker: {
      reportIncident: "Signaler un Incident",
      reportTypes: {
        harassment: "Harcèlement",
        wageTheft: "Vol de Salaire",
        unsafeConditions: "Conditions Dangereuses",
        trafficking: "Traite",
        discrimination: "Discrimination",
        childLabor: "Travail des Enfants",
      },
      anonymousReport: "Rapport Anonyme",
      reportId: "ID du Rapport",
      escalationPath: "Voie d'Escalade",
      trackReport: "Suivre le Rapport",
      reportStatus: "État du Rapport",
    },
    communityGuardian: {
      reportIncident: "Signaler un Incident",
      incidentTypes: {
        endangered: "Espèces en Danger",
        habitat: "Destruction d'Habitat",
        pollution: "Pollution",
        poaching: "Braconnage",
        deforestation: "Déforestation",
      },
      biodiversityMap: "Carte de la Biodiversité",
      hotspots: "Points Chauds",
      protectionZones: "Zones de Protection",
      trackIncident: "Suivre l'Incident",
    },
    consumer: {
      scanProduct: "Scanner un Produit",
      productOrigin: "Origine du Produit",
      workerInfo: "Informations sur les Travailleurs",
      fairWages: "Salaires Équitables",
      environmentalImpact: "Impact Environnemental",
      communityBenefits: "Avantages Communautaires",
      shareStory: "Partager une Histoire",
    },
    business: {
      supplyChain: "Chaîne d'Approvisionnement",
      supplierVerification: "Vérification des Fournisseurs",
      riskAssessment: "Évaluation des Risques",
      esGReporting: "Rapport ESG",
      complianceStatus: "État de Conformité",
    },
    features: {
      qrScanner: "Lecteur QR",
      leaderboard: "Classement",
      achievements: "Réalisations",
      rewards: "Récompenses",
      impactMetrics: "Métriques d'Impact",
      communityForum: "Forum Communautaire",
      impactStories: "Histoires d'Impact",
      notifications: "Notifications",
    },
    community: {
      forum: "Forum",
      discussions: "Discussions",
      impactStories: "Histoires d'Impact",
      voting: "Vote",
      comments: "Commentaires",
      likes: "J'aime",
      shares: "Partages",
      createPost: "Créer une Publication",
      createStory: "Créer une Histoire",
      joinDiscussion: "Rejoindre la Discussion",
      viewStory: "Voir l'Histoire",
      upvote: "Vote Positif",
      downvote: "Vote Négatif",
    },
    settings: {
      language: "Langue",
      notifications: "Notifications",
      darkMode: "Mode Sombre",
      privacy: "Confidentialité",
      about: "À Propos",
      help: "Aide",
      logout: "Déconnexion",
      changeRole: "Changer de Rôle",
    },
    messages: {
      welcome: "Bienvenue à Guardian-IO",
      thankYou: "Merci pour votre contribution",
      confirmDelete: "Êtes-vous sûr de vouloir supprimer ceci?",
      noResults: "Aucun résultat trouvé",
      tryAgain: "Réessayer",
      connectionError: "Erreur de connexion",
      offline: "Vous êtes hors ligne",
    },
  },
};

const STORAGE_KEY = "@guardian-io/language";

export class I18nManager {
  private currentLanguage: Language = "en";

  async initialize() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored && (stored === "en" || stored === "es" || stored === "fr")) {
        this.currentLanguage = stored;
      }
    } catch (error) {
      console.error("Failed to load language preference:", error);
    }
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  async setLanguage(language: Language) {
    try {
      this.currentLanguage = language;
      await AsyncStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      console.error("Failed to save language preference:", error);
    }
  }

  t(key: string): string {
    const keys = key.split(".");
    let value: any = TRANSLATIONS[this.currentLanguage];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  }

  getTranslations(): TranslationKeys {
    return TRANSLATIONS[this.currentLanguage];
  }
}

let i18nManager: I18nManager | null = null;

export function initializeI18n(): I18nManager {
  if (!i18nManager) {
    i18nManager = new I18nManager();
  }
  return i18nManager;
}

export function getI18n(): I18nManager {
  if (!i18nManager) {
    i18nManager = new I18nManager();
  }
  return i18nManager;
}

// React Hook
import { useState, useCallback } from "react";

export function useI18n() {
  const manager = getI18n();
  const [language, setLanguageState] = useState<Language>(manager.getCurrentLanguage());

  const setLanguage = useCallback(async (lang: Language) => {
    await manager.setLanguage(lang);
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return manager.t(key);
    },
    [language],
  );

  return {
    language,
    setLanguage,
    t,
    translations: manager.getTranslations(),
  };
}
