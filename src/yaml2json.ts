#!/usr/bin/env node

import * as yaml from 'js-yaml'
import * as fs from 'fs'
import * as path from 'path'

type Config = {
	yml_files: string[]
	out_dir: string
	indentation: number
}

const parse_cli_args = (args: string[]): Config => {
	// init default config
	const cfg: Config = {
		yml_files: [],
		out_dir: 'out',
		indentation: 0
	}

	// process flags and args
	for (let i = 0; i < args.length; i++) {
		const arg = args[i]
		if (arg === '-o' || arg === '--out') {
			i++
			cfg.out_dir = args[i]
		} else if (arg === '-p' || arg === '--pretty') {
			cfg.indentation = 2
		} else {
			cfg.yml_files.push(arg)
		}
	}

	// post process config (resolve out dir)
	cfg.out_dir = path.resolve(process.cwd(), cfg.out_dir)

	return cfg
}

const ensure_dir_exists = (dir: string): void => {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir)
	}
}

const get_final_out_path = (out_dir: string, inpath: string): string => {
	const out_path = path.join(out_dir, path.basename(inpath))
	return out_path.replace('.yml', '.json')
}

const yaml_to_json = (yml_text: string, indent: number): string => {
	const obj = yaml.load(yml_text)
	const json_text = JSON.stringify(obj, null, indent) + '\n'
	return json_text
}

const main = () => {
	const cfg = parse_cli_args(process.argv.slice(2))

	ensure_dir_exists(cfg.out_dir)

	for (const path of cfg.yml_files) {
		try {
			const yml_txt = fs.readFileSync(path, 'utf8')
			const json_text = yaml_to_json(yml_txt, cfg.indentation)
			const out_path = get_final_out_path(cfg.out_dir, path)
			fs.writeFileSync(out_path, json_text)
		} catch (e) {
			console.log(e)
		}
	}
}

main()
