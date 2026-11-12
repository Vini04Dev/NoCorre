export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      carteiras: {
        Row: {
          arquivada: boolean
          cor: Database["public"]["Enums"]["cor_evento"]
          created_at: string
          id: string
          nome: string
          padrao: boolean
          saldo_inicial: number
          tipo: string | null
          usuario_id: string
        }
        Insert: {
          arquivada?: boolean
          cor?: Database["public"]["Enums"]["cor_evento"]
          created_at?: string
          id?: string
          nome: string
          padrao?: boolean
          saldo_inicial?: number
          tipo?: string | null
          usuario_id?: string
        }
        Update: {
          arquivada?: boolean
          cor?: Database["public"]["Enums"]["cor_evento"]
          created_at?: string
          id?: string
          nome?: string
          padrao?: boolean
          saldo_inicial?: number
          tipo?: string | null
          usuario_id?: string
        }
        Relationships: []
      }
      categorias: {
        Row: {
          created_at: string
          id: string
          nome: string
          tipo: Database["public"]["Enums"]["tipo_categoria"]
          usuario_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          tipo: Database["public"]["Enums"]["tipo_categoria"]
          usuario_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          tipo?: Database["public"]["Enums"]["tipo_categoria"]
          usuario_id?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          created_at: string
          foto: string | null
          id: string
          nome: string
          observacao: string | null
          telefone: string | null
          tipo: Database["public"]["Enums"]["tipo_cliente"]
          usuario_id: string
        }
        Insert: {
          created_at?: string
          foto?: string | null
          id?: string
          nome: string
          observacao?: string | null
          telefone?: string | null
          tipo: Database["public"]["Enums"]["tipo_cliente"]
          usuario_id?: string
        }
        Update: {
          created_at?: string
          foto?: string | null
          id?: string
          nome?: string
          observacao?: string | null
          telefone?: string | null
          tipo?: Database["public"]["Enums"]["tipo_cliente"]
          usuario_id?: string
        }
        Relationships: []
      }
      contas_fixas: {
        Row: {
          ativa: boolean
          automatico: boolean
          carteira_id: string | null
          created_at: string
          descricao: string
          dia_vencimento: number
          id: string
          tipo: string
          usuario_id: string
          valor: number
        }
        Insert: {
          ativa?: boolean
          automatico?: boolean
          carteira_id?: string | null
          created_at?: string
          descricao: string
          dia_vencimento: number
          id?: string
          tipo: string
          usuario_id?: string
          valor: number
        }
        Update: {
          ativa?: boolean
          automatico?: boolean
          carteira_id?: string | null
          created_at?: string
          descricao?: string
          dia_vencimento?: number
          id?: string
          tipo?: string
          usuario_id?: string
          valor?: number
        }
        Relationships: []
      }
      despesas: {
        Row: {
          carteira_id: string | null
          conta_fixa_id: string | null
          created_at: string
          data_hora: string
          id: string
          meta_id: string | null
          observacao: string | null
          quantidade: number
          tipo: string
          usuario_id: string
          valor_total: number | null
          valor_unitario: number
        }
        Insert: {
          carteira_id?: string | null
          conta_fixa_id?: string | null
          created_at?: string
          data_hora?: string
          id?: string
          meta_id?: string | null
          observacao?: string | null
          quantidade?: number
          tipo: string
          usuario_id?: string
          valor_total?: number | null
          valor_unitario: number
        }
        Update: {
          carteira_id?: string | null
          conta_fixa_id?: string | null
          created_at?: string
          data_hora?: string
          id?: string
          meta_id?: string | null
          observacao?: string | null
          quantidade?: number
          tipo?: string
          usuario_id?: string
          valor_total?: number | null
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "despesas_meta_fk"
            columns: ["meta_id", "usuario_id"]
            isOneToOne: false
            referencedRelation: "metas"
            referencedColumns: ["id", "usuario_id"]
          },
        ]
      }
      eventos: {
        Row: {
          cor: Database["public"]["Enums"]["cor_evento"]
          created_at: string
          data_hora_final: string
          data_hora_inicial: string
          descricao: string
          id: string
          usuario_id: string
        }
        Insert: {
          cor?: Database["public"]["Enums"]["cor_evento"]
          created_at?: string
          data_hora_final: string
          data_hora_inicial: string
          descricao: string
          id?: string
          usuario_id?: string
        }
        Update: {
          cor?: Database["public"]["Enums"]["cor_evento"]
          created_at?: string
          data_hora_final?: string
          data_hora_inicial?: string
          descricao?: string
          id?: string
          usuario_id?: string
        }
        Relationships: []
      }
      metas: {
        Row: {
          categoria: string | null
          cliente_id: string | null
          created_at: string
          data_fim: string
          data_inicio: string
          id: string
          nome: string
          parametro: Database["public"]["Enums"]["parametro_meta"]
          parcela_atual: number | null
          parcela_total: number | null
          status: Database["public"]["Enums"]["status_meta"]
          usuario_id: string
          valor_alvo: number
        }
        Insert: {
          categoria?: string | null
          cliente_id?: string | null
          created_at?: string
          data_fim: string
          data_inicio: string
          id?: string
          nome: string
          parametro: Database["public"]["Enums"]["parametro_meta"]
          parcela_atual?: number | null
          parcela_total?: number | null
          status?: Database["public"]["Enums"]["status_meta"]
          usuario_id?: string
          valor_alvo: number
        }
        Update: {
          categoria?: string | null
          cliente_id?: string | null
          created_at?: string
          data_fim?: string
          data_inicio?: string
          id?: string
          nome?: string
          parametro?: Database["public"]["Enums"]["parametro_meta"]
          parcela_atual?: number | null
          parcela_total?: number | null
          status?: Database["public"]["Enums"]["status_meta"]
          usuario_id?: string
          valor_alvo?: number
        }
        Relationships: [
          {
            foreignKeyName: "metas_cliente_fk"
            columns: ["cliente_id", "usuario_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id", "usuario_id"]
          },
        ]
      }
      moto_componentes: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          intervalo_km: number
          km_ultima_troca: number
          nome: string
          tipo: string
          usuario_id: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          intervalo_km: number
          km_ultima_troca?: number
          nome: string
          tipo: string
          usuario_id?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          intervalo_km?: number
          km_ultima_troca?: number
          nome?: string
          tipo?: string
          usuario_id?: string
        }
        Relationships: []
      }
      moto_quilometragem: {
        Row: {
          created_at: string
          id: string
          km: number
          registrado_em: string
          usuario_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          km: number
          registrado_em?: string
          usuario_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          km?: number
          registrado_em?: string
          usuario_id?: string
        }
        Relationships: []
      }
      perfis: {
        Row: {
          ano_veiculo: number | null
          created_at: string
          foto: string | null
          id: string
          nome: string
          placa: string | null
          plano: Database["public"]["Enums"]["plano_conta"]
          telefone: string | null
          tipo_sanguineo: string | null
          veiculo: string | null
        }
        Insert: {
          ano_veiculo?: number | null
          created_at?: string
          foto?: string | null
          id: string
          nome: string
          placa?: string | null
          plano?: Database["public"]["Enums"]["plano_conta"]
          telefone?: string | null
          tipo_sanguineo?: string | null
          veiculo?: string | null
        }
        Update: {
          ano_veiculo?: number | null
          created_at?: string
          foto?: string | null
          id?: string
          nome?: string
          placa?: string | null
          plano?: Database["public"]["Enums"]["plano_conta"]
          telefone?: string | null
          tipo_sanguineo?: string | null
          veiculo?: string | null
        }
        Relationships: []
      }
      receitas: {
        Row: {
          carteira_id: string | null
          cliente_id: string
          created_at: string
          data_hora: string
          forma_pagamento: Database["public"]["Enums"]["forma_pagamento"] | null
          id: string
          observacao: string | null
          quantidade: number
          status_pagamento: Database["public"]["Enums"]["status_pagamento"]
          tipo: string
          usuario_id: string
          valor_total: number | null
          valor_unitario: number
        }
        Insert: {
          carteira_id?: string | null
          cliente_id: string
          created_at?: string
          data_hora?: string
          forma_pagamento?:
            | Database["public"]["Enums"]["forma_pagamento"]
            | null
          id?: string
          observacao?: string | null
          quantidade?: number
          status_pagamento?: Database["public"]["Enums"]["status_pagamento"]
          tipo: string
          usuario_id?: string
          valor_total?: number | null
          valor_unitario: number
        }
        Update: {
          carteira_id?: string | null
          cliente_id?: string
          created_at?: string
          data_hora?: string
          forma_pagamento?:
            | Database["public"]["Enums"]["forma_pagamento"]
            | null
          id?: string
          observacao?: string | null
          quantidade?: number
          status_pagamento?: Database["public"]["Enums"]["status_pagamento"]
          tipo?: string
          usuario_id?: string
          valor_total?: number | null
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "receitas_cliente_id_usuario_id_fkey"
            columns: ["cliente_id", "usuario_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id", "usuario_id"]
          },
        ]
      }
      transferencias: {
        Row: {
          created_at: string
          data_hora: string
          destino_id: string
          id: string
          observacao: string | null
          origem_id: string
          usuario_id: string
          valor: number
        }
        Insert: {
          created_at?: string
          data_hora?: string
          destino_id: string
          id?: string
          observacao?: string | null
          origem_id: string
          usuario_id?: string
          valor: number
        }
        Update: {
          created_at?: string
          data_hora?: string
          destino_id?: string
          id?: string
          observacao?: string | null
          origem_id?: string
          usuario_id?: string
          valor?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      eh_pro: { Args: never; Returns: boolean }
      excluir_minha_conta: { Args: never; Returns: undefined }
      saldos_carteiras: { Args: never; Returns: { carteira_id: string; saldo: number }[] }
      metricas_admin: { Args: never; Returns: Json }
      metricas_usuario_admin: { Args: { p_usuario: string }; Returns: Json }
    }
    Enums: {
      cor_evento: "amarelo" | "verde" | "vermelho" | "azul" | "roxo" | "cinza"
      forma_pagamento: "pix" | "dinheiro"
      parametro_meta: "quantidade" | "receita" | "despesa" | "conta"
      plano_conta: "gratis" | "pro"
      status_meta: "ativa" | "inativa"
      status_pagamento: "pago" | "pendente"
      tipo_categoria: "receita" | "despesa"
      tipo_cliente: "pessoa_fisica" | "empresa"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      cor_evento: ["amarelo", "verde", "vermelho", "azul", "roxo", "cinza"],
      forma_pagamento: ["pix", "dinheiro"],
      parametro_meta: ["quantidade", "receita", "despesa", "conta"],
      plano_conta: ["gratis", "pro"],
      status_meta: ["ativa", "inativa"],
      status_pagamento: ["pago", "pendente"],
      tipo_categoria: ["receita", "despesa"],
      tipo_cliente: ["pessoa_fisica", "empresa"],
    },
  },
} as const
