import yaml from "js-yaml"
import fs from "fs"
import { glob } from "glob"

// Fix __filename and __dirname in ESM
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { type } from "os"
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

const data_dir = __dirname + "/"
console.log(data_dir)

const hardwares_template = []
const translation_template = []
const liblol_template = []

const glob_options = {
    ignore: ['**/template*.yml', '**/template_*.yml', 'template*.yml']
}

export async function generate_hardwares_database(format_switch) {
    // Clear the array before processing
    hardwares_template.length = 0
    const hardwares = await glob(data_dir + "hardwares/**/*.yml", glob_options)
    hardwares.forEach(files => {
        let yamlFile = fs.readFileSync(files, 'utf-8')
        let jsonResult = yaml.load(yamlFile)
        hardwares_template.push(jsonResult)
    })
    if (format_switch === 1) {
        fs.writeFileSync(data_dir + "hardwares.json", JSON.stringify(hardwares_template, null, "\t"))
    }
    fs.writeFileSync(data_dir + "hardwares.min.json", JSON.stringify(hardwares_template))
}

export async function generate_translation_database(format_switch) {
    // Clear the array before processing
    translation_template.length = 0
    const translation = await glob(data_dir + "translation/**/*.yml", glob_options)
    translation.forEach(files => {
        let yamlFile = fs.readFileSync(files, 'utf-8')
        let jsonResult = yaml.load(yamlFile)
        translation_template.push(jsonResult)
    })
    if (format_switch === 1) {
        fs.writeFileSync(data_dir + "translation.json", JSON.stringify(translation_template, null, "\t"))
    }
    fs.writeFileSync(data_dir + "translation.min.json", JSON.stringify(translation_template))
}

export async function generate_liblol_database(format_switch) {
    // Clear the array before processing
    liblol_template.length = 0
    const liblol = await glob(data_dir + "liblol/**/*.yml", glob_options)
    liblol.forEach(files => {
        let yamlFile = fs.readFileSync(files, 'utf-8')
        let jsonResult = yaml.load(yamlFile)
        liblol_template.push(jsonResult)
    })
    if (format_switch === 1) {
        fs.writeFileSync(data_dir + "liblol.json", JSON.stringify(liblol_template, null, "\t"))
    }
    fs.writeFileSync(data_dir + "liblol.min.json", JSON.stringify(liblol_template))
}

export function generate_locales_and_vendors() {
    // Add new locale code here
    const locale_template = {
        zh: {},
        en: {}
    }

    const vendor_template = {
        zh: {},
        en: {}
    }

    // Generate locales
    // Add new locale code here like:
    locale_template.zh = JSON.parse(fs.readFileSync(data_dir + "locales/zh.json"))
    locale_template.en = JSON.parse(fs.readFileSync(data_dir + "locales/en.json"))
    // End

    // Generate locales for vendors
    // Add new locale code here like:
    vendor_template.zh = JSON.parse(fs.readFileSync(data_dir + "vendors/zh.json"))
    vendor_template.en = JSON.parse(fs.readFileSync(data_dir + "vendors/en.json"))
    // End

    fs.writeFileSync(data_dir + "locales.min.json", JSON.stringify(locale_template))
    fs.writeFileSync(data_dir + "vendors.min.json", JSON.stringify(vendor_template))
}

export async function generate_all(format_switch) {
    await generate_hardwares_database(format_switch)
    await generate_translation_database(format_switch)
    await generate_liblol_database(format_switch)
    generate_locales_and_vendors()
}

generate_all(1).catch(console.error)