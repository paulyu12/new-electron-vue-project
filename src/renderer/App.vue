/* eslint-disable */
<template>
	<div class="container">
		<div class="tabs">
			<div class="tab" :class="tabID === activeID ? 'active' : false" v-for="tabID in tabIDs" :key="tabID" @click="switchTab(tabID)">
				<component :is="isLoadingOrFavicon(tabID)" :imgSrc="tabs[tabID].favicon" />
				<div class="title">
					<div class="title-content">{{ tabs[tabID].title }}</div>
				</div>
				<div class="close" @click.stop="close(tabID)">
					<SvgIconClose />
				</div>
			</div>
			<span type="plus" style="margin-left: 10px" @click="newTab">
				<SvgIconPlus />
			</span>
		</div>
		<div class="bars">
			<div class="bar address-bar">
				<div class="actions">
					<div @click="onGoBack()">
						<SvgIconBack />
					</div>
					<div @click="onGoForward()">
						<SvgIconForward />
					</div>
					<div @click="sendStopOrReload">
						<component :is="loadingOrStopIcon" />
					</div>
				</div>
				<input class="address" v-model="inputValue" @keydown.enter.exact="onPressEnter" />
			</div>
		</div>
	</div>
</template>

<script>
import * as action from '../controls'
import SvgIconLoading from './components/SvgIconLoading'
import SvgIconClose from './components/SvgIconClose'
import SvgIconPlus from './components/SvgIconPlus'
import SvgIconBack from './components/SvgIconBack'
import SvgIconForward from './components/SvgIconForward'
import SvgIconReload from './components/SvgIconReload'
import TitleFavicon from './components/TitleFavicon'

const { ipcRenderer } = require('electron')

export default {
	name: 'App',

	data() {
		return {
			inputValue: '',
			tabs: '',
			tabIDs: '',
			activeID: '',
		}
	},

	computed: {
		isLoading: function () {
			if (!this.tabs[this.activeID]) {
				return ''
			}
			return this.tabs[this.activeID].isLoading ? true : false
		},
		canGoForward: function () {
			return this.tabs[this.activeID].canGoForward ? true : false
		},
		canGoBack: function () {
			return this.tabs[this.activeID].canGoBack ? true : false
		},
		loadingOrStopIcon: function () {
			if (this.isLoading) {
				return SvgIconClose
			} else {
				return SvgIconReload
			}
		},
	},

	components: {
		SvgIconLoading,
		SvgIconClose,
		SvgIconPlus,
		SvgIconBack,
		SvgIconForward,
		SvgIconReload,
	},

	methods: {
		isLoadingOrFavicon: function (id) {
			if (this.tabs[id].isLoading) {
				return SvgIconLoading
			} else {
				return TitleFavicon
			}
		},
		sendStopOrReload: function () {
			if (this.tabs[this.activeID].isLoading) {
				action.sendStop()
			} else {
				action.sendReload()
			}
		},
		newTab: function () {
			action.sendNewTab()
		},
		onPressEnter: function () {
			const v = this.inputValue.trim()
			if (!v) return

			let href = v
			if (!/^.*?:\/\//.test(v)) {
				href = `http://${v}`
			}
			action.sendEnterURL(href)
		},
		switchTab: function (id) {
			action.sendSwitchTab(id)
		},
		close: function (id) {
			action.sendCloseTab(id)
		},
		onGoBack: function () {
			if (this.canGoBack) {
				action.sendGoBack()
			}
		},
		onGoForward: function () {
			if (this.canGoForward) {
				action.sendGoForward()
			}
		},

		onTabsUpdate: () => {},
		onTabActive: () => {},
	},

	mounted() {
		action.sendControlReady()

		const channels = [
			[
				'tabs-update',
				(e, v) => {
					this.tabIDs = v.tabs
					this.tabs = v.confs
					// onTabsUpdate(v)
				},
			],
			[
				'active-update',
				(e, v) => {
					this.activeID = v
					if (this.tabs[v]) {
						this.inputValue = this.tabs[this.activeID].url
					} else {
						this.inputValue = ''
					}
					// const activeTab = this.tabs[v] || {}
					// onTabActive(activeTab)
				},
			],
		]

		channels.forEach(([name, listener]) => ipcRenderer.on(name, listener))
	},
}
</script>
