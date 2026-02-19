import { useDark } from '@vueuse/core'
export const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
  initialValue: 'dark'
});

export const toggleDark = () => {
  isDark.value = true
}
