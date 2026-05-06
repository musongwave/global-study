export interface Post {
  id: number
  date: string
  category: 'образование' | 'новости' | 'возможности' | 'ресурсы'
  title: string
  preview: string
  text: string
  image: string
  tags: string[]
  tg_link: string
}

export type Category = 'all' | Post['category']
