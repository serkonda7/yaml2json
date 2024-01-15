import * as yaml from 'js-yaml'
import * as glob from 'glob'
import * as fs from 'fs'
import * as path from 'path'
import * as process from 'process'

type Config = {
	yml_files: string[]
	out_dir: string
	indentation: number
}

let errors = 0

const log_error = (msg: string): void => {
	errors++
	console.log(`\x1b[31m${msg}\x1b[0m`)
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

	// post process config (resolve out dir and globs)
	cfg.out_dir = path.resolve(process.cwd(), cfg.out_dir)
	cfg.yml_files = cfg.yml_files.map((f) => glob.sync(f)).flat()

	return cfg
}

const ensure_dir_exists = (dir: string): void => {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir)
	}
}

const get_final_out_path = (out_dir: string, inpath: string): string => {
	const out_path = path.join(out_dir, path.basename(inpath))
	return out_path.replace('.yml', '.json').replace('.yaml-tmlanguage', '.json')
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
		if (!fs.existsSync(path)) {
			log_error(`file not found: ${path}`)
			continue
		}

		try {
			const yml_txt = fs.readFileSync(path, 'utf8')
			const json_text = yaml_to_json(yml_txt, cfg.indentation)
			const out_path = get_final_out_path(cfg.out_dir, path)
			fs.writeFileSync(out_path, json_text)
		} catch (e) {
			log_error((e as Error).message)
		}
	}

	if (errors > 0) {
		process.exit(1)
	}
}

main()
